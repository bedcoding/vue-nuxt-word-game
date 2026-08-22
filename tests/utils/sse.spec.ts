import { describe, expect, it } from 'vitest'
import {
  createStreamLineReader,
  formatSseEvent,
  parseSseDataLine
} from '@/utils/sse'

const encode = (text: string): Uint8Array => new TextEncoder().encode(text)

describe('createStreamLineReader', () => {
  it('줄이 끝나기 전까지는 아무것도 내보내지 않는다', () => {
    const reader = createStreamLineReader()
    expect(reader.push(encode('data: {"a":1}'))).toEqual([])
    expect(reader.push(encode('}\n'))).toEqual(['data: {"a":1}}'])
  })

  it('한 청크에 여러 줄이 들어와도 모두 분리한다', () => {
    const reader = createStreamLineReader()
    expect(reader.push(encode('one\ntwo\nthree'))).toEqual(['one', 'two'])
    expect(reader.flush()).toEqual(['three'])
  })

  it('멀티바이트 문자가 청크 경계에서 쪼개져도 깨지지 않는다', () => {
    // 이게 이 유틸의 존재 이유다. 청크마다 new TextDecoder().decode()를 하면
    // 3바이트짜리 한글이 경계에서 잘려 U+FFFD(�)로 망가진다.
    const line = 'data: {"content":"한글 스토리"}\n'
    const bytes = encode(line)

    const reader = createStreamLineReader()
    const out: string[] = []

    // 1바이트씩 밀어넣어 최악의 경계 조건을 만든다
    for (const byte of bytes) {
      out.push(...reader.push(Uint8Array.of(byte)))
    }
    out.push(...reader.flush())

    expect(out).toEqual(['data: {"content":"한글 스토리"}'])
    expect(out.join('')).not.toContain('�')
  })

  it('청크마다 새 디코더를 쓰면 실제로 깨진다는 것을 확인한다 (회귀 근거)', () => {
    const bytes = encode('한글')
    const naive =
      new TextDecoder().decode(bytes.slice(0, 2)) +
      new TextDecoder().decode(bytes.slice(2))

    expect(naive).toContain('�')
    expect(naive).not.toBe('한글')
  })

  it('flush는 버퍼를 비운다', () => {
    const reader = createStreamLineReader()
    reader.push(encode('tail'))
    expect(reader.flush()).toEqual(['tail'])
    expect(reader.flush()).toEqual([])
  })
})

describe('parseSseDataLine', () => {
  it('data 라인에서 payload만 뽑는다', () => {
    expect(parseSseDataLine('data: {"type":"title"}')).toBe('{"type":"title"}')
  })

  it('CRLF 개행이 남아 있어도 처리한다', () => {
    expect(parseSseDataLine('data: [DONE]\r')).toBe('[DONE]')
  })

  it('data 라인이 아니거나 비어 있으면 null', () => {
    expect(parseSseDataLine(': keep-alive')).toBeNull()
    expect(parseSseDataLine('event: message')).toBeNull()
    expect(parseSseDataLine('')).toBeNull()
    expect(parseSseDataLine('data:')).toBeNull()
    expect(parseSseDataLine('data:   ')).toBeNull()
  })
})

describe('formatSseEvent', () => {
  it('SSE 프레임 형식으로 직렬화한다', () => {
    expect(formatSseEvent({ type: 'title', title: '고대 서고' })).toBe(
      'data: {"type":"title","title":"고대 서고"}\n\n'
    )
  })
})
