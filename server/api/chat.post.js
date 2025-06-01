export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { message } = body

    // ChatGPT API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 가성비 좋은 모델 (무료: 250만토큰/일, $0.15/$0.6 per 1M)
        // model: 'gpt-4.1-mini', // 고성능 모델 (무료: 250만토큰/일, $0.40/$1.6 per 1M, MMLU 87.5%)
        messages: [
          {
            role: 'user',
            content: message || '안녕하세요! 테스트 메시지입니다.'
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`ChatGPT API 오류: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      message: data.choices[0].message.content,
      usage: data.usage
    }
  } catch (error) {
    console.error('ChatGPT API 호출 실패:', error)
    return {
      success: false,
      error: error.message
    }
  }
}) 