import type { H3Event } from 'h3'
import { getHeader, getRequestHost, createError } from 'h3'

/**
 * 이 요청에 대해 허용되는 Origin 목록.
 *
 * - NUXT_ALLOWED_ORIGINS 를 설정하면 **그 목록만** 허용한다(엄격 모드).
 *   Origin 판정이 요청 헤더에 전혀 의존하지 않으므로 가장 안전하다.
 *   배포 도메인이 고정됐다면 이 방식을 쓰는 게 좋다.
 * - 설정하지 않으면 요청이 도착한 host를 허용한다(관용 모드).
 *   Vercel 프리뷰 배포처럼 도메인이 매번 바뀌는 환경을 위한 편의 장치다.
 *   대신 Host 헤더를 신뢰하게 되므로 엄격 모드보다 약하다.
 *   (x-forwarded-host는 클라이언트가 채워 보낼 수 있어 일부러 쓰지 않는다)
 */
export function getAllowedOrigins(event: H3Event): string[] {
  const configured = useRuntimeConfig(event).allowedOrigins || ''

  const fromConfig = configured
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)

  if (fromConfig.length > 0 && !import.meta.dev) {
    return [...new Set(fromConfig)]
  }

  const host = getRequestHost(event)
  const origins = [`https://${host}`, ...fromConfig]

  if (import.meta.dev) {
    origins.push(`http://${host}`, 'http://localhost:3000')
  }

  return [...new Set(origins)]
}

/**
 * Origin 화이트리스트 검사.
 *
 * 기존 코드는 `if (origin && !allowed.includes(origin))` 이었는데,
 * Origin 헤더가 아예 없으면 검사를 건너뛰어 curl 같은 비브라우저 호출이
 * 그대로 통과했다. 브라우저는 GET/HEAD가 아닌 요청에 항상 Origin을 붙이므로
 * (동일 출처 POST 포함) "Origin 없음"은 정상적인 게임 트래픽이 아니다.
 */
export function assertTrustedOrigin(event: H3Event): void {
  if (import.meta.dev) return

  const origin = getHeader(event, 'origin')

  if (!origin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Origin header required'
    })
  }

  if (!getAllowedOrigins(event).includes(origin)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid Origin'
    })
  }
}

/**
 * 클라이언트 IP.
 *
 * x-forwarded-for는 클라이언트가 임의로 채워 보낼 수 있고 프록시를 거치며
 * 값이 덧붙는다. 그래서 (1) 플랫폼이 직접 세팅하는 x-real-ip를 먼저 믿고,
 * (2) x-forwarded-for는 맨 앞 항목만 쓴다.
 */
export function getClientIp(event: H3Event): string {
  const realIp = getHeader(event, 'x-real-ip')
  if (realIp) return realIp.trim()

  const forwarded = getHeader(event, 'x-forwarded-for')
  const first = forwarded?.split(',')[0]?.trim()
  if (first) return first

  return event.node.req.socket?.remoteAddress || 'unknown'
}
