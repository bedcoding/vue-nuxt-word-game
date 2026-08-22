import { createError, readBody } from 'h3'
import type { GameRegion } from '~/types/game'
import { regionsDatabase } from '~/data/regions/index'
import { GAME_CONFIG, STORY_API_CONFIG } from '~/constants/game.config'
import { createStreamLineReader, formatSseEvent, parseSseDataLine } from '~/utils/sse'

/** 제목과 본문을 나누는 구분자 (프롬프트에서 이 형식을 요구한다) */
const TITLE_SEPARATOR = '|||'

const RATE_LIMIT_RULES = [
  { label: '1분당 6회', windowMs: 60_000, max: 6 },
  { label: '10분당 30회', windowMs: 10 * 60_000, max: 30 },
  { label: '1시간당 120회', windowMs: 60 * 60_000, max: 120 }
] as const

/**
 * 요청 본문은 stageNumber/regionId 두 개만 받는다.
 *
 * 이전 맥락과 적 이름은 이 둘로 서버에서 전부 유도할 수 있다.
 * 클라이언트가 보낸 문자열을 프롬프트에 그대로 끼워넣지 않으므로
 * 프롬프트 인젝션 경로가 없어지고, "의심스러운 패턴" 문자열 필터도 필요 없어진다.
 */
interface StoryRequest {
  stageNumber: number
  regionId: number
}

function parseStoryRequest(body: unknown): StoryRequest {
  const { stageNumber, regionId } = (body ?? {}) as Record<string, unknown>

  const isValidStage =
    typeof stageNumber === 'number' &&
    Number.isInteger(stageNumber) &&
    stageNumber >= 1 &&
    stageNumber <= GAME_CONFIG.totalStages

  const isValidRegion =
    typeof regionId === 'number' &&
    Number.isInteger(regionId) &&
    regionId >= 1 &&
    regionId <= GAME_CONFIG.totalRegions

  if (!isValidStage || !isValidRegion) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: invalid stageNumber or regionId'
    })
  }

  return { stageNumber: stageNumber as number, regionId: regionId as number }
}

export default defineEventHandler(async (event) => {
  // ── 1. 스트림을 열기 전에 모든 검증을 끝낸다 ────────────────────────────
  // 응답 헤더를 내보낸 뒤에는 상태 코드를 바꿀 수 없으므로 순서가 중요하다.
  // HTTP 메서드 제한은 파일명 규칙(.post.ts)이 이미 처리한다.
  assertTrustedOrigin(event)
  enforceRateLimit('story-stream', getClientIp(event), RATE_LIMIT_RULES)

  const { stageNumber, regionId } = parseStoryRequest(await readBody(event))

  const region = regionsDatabase.find(item => item.id === regionId)
  const stage = region?.stages.find(item => item.stage === stageNumber)

  if (!region || !stage) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found: unknown stage' })
  }

  const apiKey = useRuntimeConfig(event).openaiApiKey || process.env.OPENAI_API_KEY
  if (!apiKey) {
    // 키가 없는 건 클라이언트 잘못이 아니므로 503. 클라이언트는 하드코딩 스토리로 폴백한다.
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable: story generation is not configured'
    })
  }

  // ── 2. SSE 응답 시작 ──────────────────────────────────────────────────
  const res = event.node.res
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    // nginx 계열 프록시가 응답을 버퍼링해 스트리밍을 죽이는 것을 막는다
    'X-Accel-Buffering': 'no'
  })

  const upstream = new AbortController()
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  let closed = false
  let timedOut = false

  const write = (chunk: string): void => {
    if (!closed && !res.writableEnded) res.write(chunk)
  }

  const heartbeat = setInterval(
    // 코멘트 프레임(":"으로 시작)은 클라이언트가 무시한다. 연결 유지 목적.
    () => write(': keep-alive\n\n'),
    STORY_API_CONFIG.heartbeatInterval
  )

  const timeout = setTimeout(() => {
    timedOut = true
    upstream.abort()
  }, STORY_API_CONFIG.upstreamTimeout)

  /** 몇 번 불려도 안전하게 만든 정리 함수 */
  const cleanup = (): void => {
    if (closed) return
    closed = true
    clearInterval(heartbeat)
    clearTimeout(timeout)
    upstream.abort()
    reader?.cancel().catch(() => {})
    if (!res.writableEnded) res.end()
  }

  // 사용자가 탭을 닫거나 페이지를 벗어나면 OpenAI 호출까지 같이 취소한다.
  // 이게 없으면 아무도 보지 않는 응답을 끝까지 받으면서 토큰을 계속 쓴다.
  event.node.req.on('close', cleanup)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: STORY_API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content:
              '당신은 판타지 RPG 게임의 스토리 작가입니다. 반드시 한국어로만 응답하고, 영어 학습 게임의 스토리를 생성해주세요. 다른 언어를 섞지 마세요.'
          },
          { role: 'user', content: buildStoryPrompt(region, stageNumber) }
        ],
        max_tokens: STORY_API_CONFIG.maxTokens,
        temperature: STORY_API_CONFIG.temperature,
        stream: true
      }),
      signal: upstream.signal
    })

    if (!response.ok || !response.body) {
      const detail = await response.text().catch(() => '')
      // 업스트림 원문은 로그에만 남긴다 (조직/모델 정보가 섞여 나올 수 있음)
      console.error('[story] OpenAI 오류', response.status, detail.slice(0, 500))
      write(formatSseEvent({ type: 'error', error: 'STORY_UPSTREAM_ERROR' }))
      return
    }

    reader = response.body.getReader()
    const lineReader = createStreamLineReader()

    let title = ''
    let content = ''
    let titleResolved = false

    const consumeLine = (line: string): void => {
      const data = parseSseDataLine(line)
      if (!data || data === '[DONE]') return

      let delta = ''
      try {
        delta = JSON.parse(data)?.choices?.[0]?.delta?.content ?? ''
      } catch {
        // 줄 단위로 정확히 잘라서 넘기므로, 여기 오면 실제로 형식이 깨진 청크다.
        console.warn('[story] SSE 청크 파싱 실패:', data.slice(0, 120))
        return
      }
      if (!delta) return

      if (titleResolved) {
        content += delta
        write(formatSseEvent({ type: 'content', content: delta }))
        return
      }

      // 아직 구분자를 못 만났으면 제목 버퍼에 쌓는다
      title += delta
      const markerAt = title.indexOf(TITLE_SEPARATOR)
      if (markerAt === -1) return

      const leftover = title.slice(markerAt + TITLE_SEPARATOR.length)
      title = stripWrappingQuotes(title.slice(0, markerAt))
      titleResolved = true

      write(formatSseEvent({ type: 'title', title }))

      // 구분자와 같은 청크에 본문이 섞여 온 경우 (기존 코드는 이 조각을 흘렸다)
      if (leftover) {
        content = leftover
        write(formatSseEvent({ type: 'content', content: leftover }))
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (closed) return
      for (const line of lineReader.push(value)) consumeLine(line)
    }
    for (const line of lineReader.flush()) consumeLine(line)

    write(
      formatSseEvent({
        type: 'complete',
        title: stripWrappingQuotes(title) || `${stageNumber}단계`,
        content: stripWrappingQuotes(content)
      })
    )
  } catch (error) {
    // 클라이언트가 끊어서 생긴 abort는 정상 흐름이므로 로그를 남기지 않는다
    if (!upstream.signal.aborted) {
      console.error('[story] 스트리밍 실패:', error)
    }
    write(formatSseEvent({ type: 'error', error: timedOut ? 'STORY_TIMEOUT' : 'STORY_FAILED' }))
  } finally {
    cleanup()
  }
})

/** 앞뒤를 감싼 따옴표만 제거한다 */
function stripWrappingQuotes(text: string): string {
  return text.trim().replace(/^["']|["']$/g, '').trim()
}

/**
 * 이전 스테이지 정보로 맥락 문장을 만든다.
 * 클라이언트가 보내주는 게 아니라 서버가 지역 데이터에서 직접 유도한다.
 */
function buildPreviousContext(region: GameRegion, stageNumber: number): string {
  if (stageNumber <= 1) return '새로운 모험의 시작입니다.'

  const previous = region.stages.find(item => item.stage === stageNumber - 1)
  if (!previous) return ''

  return `이전 단계에서 ${previous.enemy.name}을(를) 물리치고 "${previous.storyTitle}"를 지나왔습니다.`
}

function buildStoryPrompt(region: GameRegion, stageNumber: number): string {
  const stage = region.stages.find(item => item.stage === stageNumber)
  const enemyName = stage?.enemy.name ?? '알 수 없는 존재'
  const isBossStage = stageNumber === GAME_CONFIG.totalStages

  return `${region.title} ${stageNumber}단계의 스토리를 생성해주세요.

설정:
- 지역: ${region.title} (${region.description})
- 단계: ${stageNumber}/${GAME_CONFIG.totalStages}
- 적: ${enemyName}
- 장르: 판타지 RPG
- 목적: 영어 단어 학습 게임
- 이전 맥락: ${buildPreviousContext(region, stageNumber)}

요구사항:
1. 반드시 한국어로만 작성 (다른 언어 절대 사용 금지)
2. 다음 형식으로 응답: 스토리 제목${TITLE_SEPARATOR}스토리 내용
3. 제목은 10자 이내
4. 내용은 150-200자 정도
5. 흥미진진하고 모험적인 분위기
6. 영어 학습 게임임을 자연스럽게 언급
7. ${isBossStage ? '최종 보스전의 긴장감' : '다음 단계로의 기대감'} 표현
8. 적 이름은 반드시 "${enemyName}" 그대로 사용

예시 형식:
고대 서고${TITLE_SEPARATOR}2층에는 고대의 서고가 있습니다. 오래된 마법서들이 스스로 날아다니며 주문을 중얼거립니다.`
}
