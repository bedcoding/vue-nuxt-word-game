import { getHeader, getRequestURL, setHeader, setResponseStatus } from 'h3'
import { getAllowedOrigins } from '../utils/origin'

/**
 * /api/* 응답의 CORS 헤더를 한 곳에서 처리한다.
 *
 * 기존에는 핸들러가 Origin 화이트리스트를 검사하면서 동시에
 * `Access-Control-Allow-Origin: *` 를 내보내 정책이 서로 모순됐다.
 * 여기서는 허용 목록에 있는 Origin만 그대로 반사하고, 응답이 Origin에
 * 따라 달라지므로 `Vary: Origin` 을 붙인다(캐시 오염 방지).
 *
 * 페이지 응답까지 Vary를 붙이면 CDN 캐시 효율이 떨어지므로 /api/ 로 한정한다.
 */
export default defineEventHandler((event) => {
  if (!getRequestURL(event).pathname.startsWith('/api/')) return

  const origin = getHeader(event, 'origin')

  if (origin && getAllowedOrigins(event).includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
    setHeader(event, 'Vary', 'Origin')
  }

  if (event.method === 'OPTIONS') {
    setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
    setHeader(event, 'Access-Control-Max-Age', 86400)
    setResponseStatus(event, 204)
    return null
  }
})
