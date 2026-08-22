import { describe, expect, it } from 'vitest'
import { pickOne, randomInt, shuffle } from '@/utils/random'

describe('randomInt', () => {
  it('rng를 주입하면 결정적으로 동작한다', () => {
    expect(randomInt(10, 30, () => 0)).toBe(10)
    expect(randomInt(10, 30, () => 0.5)).toBe(20)
    // rng는 [0, 1) 이므로 0.999...가 상한
    expect(randomInt(10, 30, () => 0.999999)).toBe(30)
  })

  it('양쪽 끝을 포함한 범위 안에만 나온다', () => {
    for (let i = 0; i < 500; i++) {
      const value = randomInt(15, 40)
      expect(value).toBeGreaterThanOrEqual(15)
      expect(value).toBeLessThanOrEqual(40)
      expect(Number.isInteger(value)).toBe(true)
    }
  })

  it('min == max면 그 값만 나온다', () => {
    expect(randomInt(7, 7)).toBe(7)
  })

  it('범위가 뒤집혀 있으면 조용히 넘기지 않고 던진다', () => {
    expect(() => randomInt(10, 5)).toThrow()
  })
})

describe('shuffle', () => {
  it('원본을 변경하지 않는다', () => {
    const original = ['a', 'b', 'c']
    shuffle(original)
    expect(original).toEqual(['a', 'b', 'c'])
  })

  it('원소를 잃거나 더하지 않는다 (순열이다)', () => {
    const input = ['apple', 'banana', 'orange']
    for (let i = 0; i < 200; i++) {
      expect([...shuffle(input)].sort()).toEqual([...input].sort())
    }
  })

  it('rng를 주입하면 결정적으로 동작한다', () => {
    // Fisher-Yates: i=2에서 result[2]<->result[0], i=1에서 result[1]<->result[0]
    expect(shuffle(['a', 'b', 'c'], () => 0)).toEqual(['b', 'c', 'a'])
  })

  it('3개 선택지의 모든 순서가 실제로 나온다', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 3000; i++) {
      seen.add(shuffle(['a', 'b', 'c']).join(''))
    }
    expect(seen.size).toBe(6)
  })
})

describe('pickOne', () => {
  it('빈 배열이면 undefined', () => {
    expect(pickOne([])).toBeUndefined()
  })

  it('rng를 주입하면 결정적으로 동작한다', () => {
    expect(pickOne(['a', 'b', 'c'], () => 0)).toBe('a')
    expect(pickOne(['a', 'b', 'c'], () => 0.99)).toBe('c')
  })
})
