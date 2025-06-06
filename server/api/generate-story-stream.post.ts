// Nuxt 3 서버 함수들 import
import { getHeader, createError, readBody } from 'h3'

// 📝 API 요청 타입 정의
interface StoryRequestBody {
  stageNumber: number;
  regionId: number;
  previousContext?: string;
  actualEnemyName?: string; // 🔧 실제 게임에서 사용하는 적 이름
}

export default defineEventHandler(async (event) => {
  try {
    // 🛡️ HTTP Method 검증
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // 🛡️ 입력값 검증
    const body: StoryRequestBody = await readBody(event)
    const { stageNumber, regionId, previousContext, actualEnemyName } = body

    if (!stageNumber || !regionId || typeof stageNumber !== 'number' || typeof regionId !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: stageNumber and regionId are required'
      })
    }

    // 🛡️ API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error: API key not configured'
      })
    }

    // 지역별 설정
    const regionConfig = {
      1: { name: '마법 도서관', theme: '도서관과 지식', enemy: '정령과 마법서' },
      2: { name: '시간의 미로', theme: '시간과 미로', enemy: '시간 수호자' },
      3: { name: '어둠의 성', theme: '어둠과 성', enemy: '어둠의 존재' }
    }

    const region = regionConfig[regionId as keyof typeof regionConfig] || regionConfig[1]
    const prompt = createStoryPrompt(stageNumber, region, previousContext, actualEnemyName)

    console.log('🤖 스트리밍 스토리 생성 시작:', { stageNumber, regionId })

    // Server-Sent Events 헤더 설정
    event.node.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    // ChatGPT 스트리밍 API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 판타지 RPG 게임의 스토리 작가입니다. 반드시 한국어로만 응답하고, 영어 학습 게임의 스토리를 생성해주세요. 다른 언어를 섞지 마세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
        stream: true // 스트리밍 활성화
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API 오류:', errorData)
      
      // 오류 시 이벤트 전송
      event.node.res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        error: `OpenAI API Error: ${response.statusText}` 
      })}\n\n`)
      event.node.res.end()
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('스트림 리더를 가져올 수 없습니다')
    }

    let fullContent = ''
    let titleExtracted = false
    let title = ''
    let buffer = '' // 🔧 불완전한 JSON 청크를 저장할 버퍼

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          console.log('✅ 스트리밍 완료')
          console.log('📄 최종 제목:', title)
          console.log('📄 최종 내용:', fullContent)
          
          // 🔧 최종 쌍따옴표 제거
          const finalTitle = title.replace(/^["']|["']$/g, '') || `${stageNumber}단계`
          const finalContent = fullContent.replace(/^["']|["']$/g, '')
          
          // 완료 이벤트 전송 (안전한 처리)
          try {
            const completeEvent = JSON.stringify({ 
              type: 'complete',
              title: finalTitle,
              content: finalContent
            })
            event.node.res.write(`data: ${completeEvent}\n\n`)
          } catch (jsonError) {
            console.error('완료 JSON 직렬화 오류:', jsonError)
            // 최소한의 완료 이벤트라도 전송
            event.node.res.write(`data: {"type":"complete","title":"${stageNumber}단계","content":"스토리 로딩 완료"}\n\n`)
          }
          break
        }

        // 청크 디코딩
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              continue
            }

            try {
              // 🔧 빈 데이터나 불완전한 데이터 필터링
              if (!data || data.trim() === '' || data.length < 10) {
                continue
              }
              
              // 🔧 버퍼에 이전 불완전한 데이터가 있다면 합치기
              let jsonToProcess = buffer + data
              
              const parsed = JSON.parse(jsonToProcess)
              
              // ✅ 파싱 성공 시 버퍼 초기화
              buffer = ''
              const content = parsed.choices?.[0]?.delta?.content || ''
              
              if (content) {
                fullContent += content
                
                // 제목과 내용 분리 (|||로 구분)
                if (!titleExtracted && fullContent.includes('|||')) {
                  const parts = fullContent.split('|||')
                  title = parts[0].trim()
                  fullContent = parts[1]?.trim() || ''
                  titleExtracted = true
                  
                  // 🔧 쌍따옴표 제거
                  title = title.replace(/^["']|["']$/g, '')
                  
                  console.log('📝 제목 추출 완료:', title)
                  
                  // 제목 이벤트 전송 (안전한 처리)
                  try {
                    const titleEvent = JSON.stringify({ 
                      type: 'title', 
                      title 
                    })
                    event.node.res.write(`data: ${titleEvent}\n\n`)
                  } catch (jsonError) {
                    console.error('🚨 제목 JSON 직렬화 오류:', jsonError)
                  }
                } else if (titleExtracted) {
                  // 내용 청크 이벤트 전송 (안전한 처리)
                  try {
                    const contentEvent = JSON.stringify({ 
                      type: 'content', 
                      content 
                    })
                    event.node.res.write(`data: ${contentEvent}\n\n`)
                  } catch (jsonError) {
                    console.error('🚨 내용 JSON 직렬화 오류:', jsonError, '청크:', content)
                    // JSON 오류가 있어도 텍스트 자체는 fullContent에 추가되므로 계속 진행
                  }
                }
              }
            } catch (parseError) {
              // 🔧 JSON 파싱 실패 시 버퍼에 저장하여 다음 청크와 합치기
              if (data.includes('{') && !data.includes('}')) {
                console.log('🔄 불완전한 JSON 청크 감지, 버퍼에 저장:', data.substring(0, 50) + '...')
                buffer = data
                continue
              }
              
              console.error('🚨 JSON 파싱 오류:', parseError)
              console.error('📊 파싱 실패한 데이터 길이:', data.length)
              console.error('📊 파싱 실패한 데이터 미리보기:', data.substring(0, 100) + (data.length > 100 ? '...' : ''))
              console.error('📊 파싱 실패한 전체 데이터:', data)
              
              // 🔧 버퍼 초기화 (계속 실패하지 않도록)
              buffer = ''
              continue
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
      event.node.res.end()
    }

  } catch (error) {
    console.error('스트리밍 스토리 생성 오류:', error)
    
    if (!event.node.res.headersSent) {
      event.node.res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      })
    }
    
    event.node.res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })}\n\n`)
    event.node.res.end()
  }
})

function createStoryPrompt(stageNumber: number, region: any, previousContext?: string, actualEnemyName?: string): string {
  const contextText = previousContext ? `\n이전 맥락: ${previousContext}` : ''
  
  // 🔧 단계별 다양한 적 이름 생성
  const getVariedEnemyName = (stageNumber: number, baseEnemy: string): string => {
    const variations: Record<string, string[]> = {
      '정령과 마법서': [
        '도서관 정령', '고대 정령', '지식의 수호자', '마법서 정령', '지혜의 파수꾼',
        '서고 관리자', '정령 마법사', '고대 문헌의 수호자', '마법 정령', '도서관 마스터'
      ],
      '시간 수호자': [
        '시간 정령', '시계 기사', '과거의 망령', '미래 예언자', '시간여행자',
        '크로노스 워리어', '시간 마법사', '영원의 수호자', '시공간 조작자', '운명의 직조자'
      ],
      '어둠의 존재': [
        '그림자 기사', '어둠의 마법사', '밤의 지배자', '어둠 정령', '공포의 화신',
        '그림자 군주', '어둠의 전사', '악몽의 수호자', '어둠 마스터', '섀도우 킹'
      ]
    }
    
    const varList = variations[baseEnemy] || [baseEnemy]
    const index = (stageNumber - 1) % varList.length
    return varList[index]
  }
  
  // 🔧 실제 게임 적 이름 우선 사용, 없으면 다양한 이름 생성
  const enemyName = actualEnemyName || getVariedEnemyName(stageNumber, region.enemy)
  
  return `
${region.name} ${stageNumber}단계의 스토리를 생성해주세요.

설정:
- 지역: ${region.name} (${region.theme} 테마)
- 단계: ${stageNumber}/10
- 적: ${enemyName}
- 장르: 판타지 RPG
- 목적: 영어 단어 학습 게임${contextText}

요구사항:
1. 반드시 한국어로만 작성 (다른 언어 절대 사용 금지)
2. 다음 형식으로 응답: "스토리 제목|||스토리 내용"
3. 제목은 10자 이내
4. 내용은 150-200자 정도
5. 흥미진진하고 모험적인 분위기
6. 영어 학습 게임임을 자연스럽게 언급
7. ${stageNumber === 10 ? '최종 보스전의 긴장감' : '다음 단계로의 기대감'} 표현
8. 🚨 중요: 적 이름을 "${enemyName}"로 정확히 사용해주세요!

예시 형식:
"고대 서고|||2층에는 고대의 서고가 있습니다. 오래된 마법서들이 스스로 날아다니며 주문을 중얼거립니다."
  `
} 