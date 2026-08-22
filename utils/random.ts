// 랜덤 유틸. rng를 주입할 수 있게 만들어서 테스트에서 결정적으로 돌릴 수 있다.
// 예: shuffle(choices, () => 0) 처럼 고정된 rng를 넘기면 결과가 항상 같다.

export type Rng = () => number

/** min~max 사이의 정수 (양쪽 끝 포함) */
export function randomInt(min: number, max: number, rng: Rng = Math.random): number {
  if (max < min) throw new Error(`randomInt: max(${max})가 min(${min})보다 작습니다`)
  return min + Math.floor(rng() * (max - min + 1))
}

/**
 * Fisher–Yates 셔플. 원본을 건드리지 않고 새 배열을 돌려준다.
 * `sort(() => Math.random() - 0.5)`는 비교 함수가 비일관적이라 분포가 균일하지 않다.
 */
export function shuffle<T>(input: readonly T[], rng: Rng = Math.random): T[] {
  const result = input.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]] as [T, T]
  }
  return result
}

/** 배열에서 하나를 고른다. 빈 배열이면 undefined */
export function pickOne<T>(input: readonly T[], rng: Rng = Math.random): T | undefined {
  if (input.length === 0) return undefined
  return input[Math.floor(rng() * input.length)]
}
