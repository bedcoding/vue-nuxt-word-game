import { onMounted, ref, type CSSProperties, type Ref } from 'vue'
import { randomInt } from '@/utils/random'

/** :style에 바로 바인딩할 수 있도록 CSSProperties와 호환되게 둔다 */
export type ParticleStyle = CSSProperties & {
  left: string
  top: string
  animationDelay: string
  animationDuration?: string
}

export interface ParticleOptions {
  /** 애니메이션 시작 지연 최대값(초) */
  maxDelay?: number
  /** 애니메이션 길이 범위(초). 주면 animationDuration을 넣는다 */
  duration?: { min: number; max: number }
  /** top을 고정할 때 사용 (예: 화면 위에서 떨어지는 색종이) */
  fixedTop?: string
}

/**
 * 장식용 파티클의 좌표/타이밍을 마운트 후에 한 번만 만든다.
 *
 * 템플릿에서 Math.random()을 직접 쓰면 서버 렌더 결과와 클라이언트 첫 렌더가
 * 달라져서 하이드레이션 불일치가 발생한다(콘솔 에러 + 하이드레이션 직후 깜빡임).
 * onMounted에서 채우면 서버는 빈 배열로 그리고 클라이언트 첫 렌더도 빈 배열이라
 * 불일치가 생기지 않는다. 장식이라 SSR에 없어도 아무 손해가 없다.
 */
export function useRandomParticles(
  count: number,
  options: ParticleOptions = {}
): Ref<ParticleStyle[]> {
  const particles = ref<ParticleStyle[]>([])
  const { maxDelay = 3, duration, fixedTop } = options

  onMounted(() => {
    particles.value = Array.from({ length: count }, () => {
      const style: ParticleStyle = {
        left: `${randomInt(0, 100)}%`,
        top: fixedTop ?? `${randomInt(0, 100)}%`,
        animationDelay: `${(Math.random() * maxDelay).toFixed(2)}s`
      }

      if (duration) {
        const span = duration.max - duration.min
        style.animationDuration = `${(duration.min + Math.random() * span).toFixed(2)}s`
      }

      return style
    })
  })

  return particles
}
