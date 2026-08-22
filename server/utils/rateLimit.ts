import { createError } from 'h3'

export interface RateLimitRule {
  /** 사람이 읽을 라벨 (로그/에러 메시지용) */
  label: string
  /** 관측 구간(ms) */
  windowMs: number
  /** 구간 내 허용 횟수 */
  max: number
}

/**
 * ⚠️ 인메모리 레이트리밋의 한계
 *
 * 서버리스(Vercel Functions)에서는 인스턴스가 여러 개 뜨고 콜드스타트마다
 * 메모리가 초기화된다. 따라서 이 구현은 "실수로 연타하는 사용자"는 막지만
 * 병렬로 때리는 의도적 남용은 막지 못한다. 그걸 막으려면 Redis/KV 같은
 * 외부 저장소로 카운터를 옮겨야 한다.
 *
 * 여기서는 (1) 남용 방어의 1차 방어선은 Origin 검증이고,
 * (2) 레이트리밋은 사고 방지용 보조 장치라는 전제로 인메모리를 유지한다.
 */

/** 인스턴스당 추적할 최대 키 개수. 넘으면 가장 오래된 것부터 버린다. */
const MAX_TRACKED_KEYS = 5_000

const buckets = new Map<string, Map<string, number[]>>()

function getBucket(name: string): Map<string, number[]> {
  let bucket = buckets.get(name)
  if (!bucket) {
    bucket = new Map<string, number[]>()
    buckets.set(name, bucket)
  }
  return bucket
}

/**
 * 요청을 기록하고, 규칙을 넘었으면 429를 던진다.
 * @param bucketName 엔드포인트별 카운터 분리용 이름
 * @param key 보통 클라이언트 IP
 */
export function enforceRateLimit(
  bucketName: string,
  key: string,
  rules: readonly RateLimitRule[],
  now: number = Date.now()
): void {
  const bucket = getBucket(bucketName)
  const longestWindow = Math.max(...rules.map(rule => rule.windowMs))

  // 만료된 기록은 버린다
  const history = (bucket.get(key) ?? []).filter(at => now - at < longestWindow)

  for (const rule of rules) {
    const hits = history.filter(at => now - at < rule.windowMs).length
    if (hits >= rule.max) {
      console.warn(
        `[rate-limit] ${bucketName} 차단: key=${key} rule=${rule.label} (${hits}/${rule.max})`
      )
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests'
      })
    }
  }

  history.push(now)
  bucket.set(key, history)

  // Map이 무한히 커지는 것 방지 (Map은 삽입 순서를 유지하므로 맨 앞이 가장 오래된 키)
  if (bucket.size > MAX_TRACKED_KEYS) {
    const oldest = bucket.keys().next()
    if (!oldest.done) bucket.delete(oldest.value)
  }
}
