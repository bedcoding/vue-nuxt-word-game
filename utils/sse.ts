// SSE(Server-Sent Events) 스트림 파싱 유틸.
//
// 스트림 청크는 "논리적인 한 줄"과 무관하게 잘려서 도착한다.
// 그래서 두 가지를 반드시 스트리밍으로 처리해야 한다.
//  1) UTF-8 디코딩: 한글은 3바이트라 청크 경계에서 쪼개지면 글자가 깨진다.
//     -> TextDecoder를 재사용하고 { stream: true }로 디코딩한다.
//  2) 줄 단위 분할: 마지막 줄은 아직 끝나지 않았을 수 있으므로 버퍼에 남겨둔다.

export interface StreamLineReader {
  /** 청크를 넣고, 완성된 줄들만 돌려받는다 */
  push(chunk: Uint8Array): string[]
  /** 스트림이 끝났을 때 버퍼에 남은 것을 꺼낸다 */
  flush(): string[]
}

export function createStreamLineReader(): StreamLineReader {
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  return {
    push(chunk: Uint8Array): string[] {
      buffer += decoder.decode(chunk, { stream: true })
      const lines = buffer.split('\n')
      // 마지막 조각은 아직 미완성일 수 있으니 버퍼로 되돌린다
      buffer = lines.pop() ?? ''
      return lines
    },
    flush(): string[] {
      buffer += decoder.decode()
      const rest = buffer
      buffer = ''
      return rest.length > 0 ? rest.split('\n') : []
    }
  }
}

/** "data: {...}" 라인에서 payload만 뽑는다. data 라인이 아니거나 비어 있으면 null */
export function parseSseDataLine(line: string): string | null {
  const normalized = line.replace(/\r$/, '')
  if (!normalized.startsWith('data:')) return null
  const data = normalized.slice('data:'.length).trimStart()
  return data.length > 0 ? data : null
}

/** SSE 이벤트 한 건을 직렬화한다 */
export function formatSseEvent(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`
}
