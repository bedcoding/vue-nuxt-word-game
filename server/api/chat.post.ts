// Nuxt 3 서버 함수들 import
import { getHeader, createError, readBody } from 'h3'

// 📝 API 요청/응답 타입 정의
interface ChatRequestBody {
  message: string;
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: OpenAIMessage;
    finish_reason: string;
    index: number;
  }>;
  usage: OpenAIUsage;
  id: string;
  object: string;
  created: number;
  model: string;
}

interface ChatAPIResponse {
  success: boolean;
  message?: string;
  usage?: OpenAIUsage;
  error?: string;
}

// 📝 레이트 리미팅 타입 정의
interface RateLimitConfig {
  window: number;
  maxRequests: number;
}

interface RateLimitWindows {
  short: RateLimitConfig;
  medium: RateLimitConfig;
  long: RateLimitConfig;
}

// 전역 변수 타입 확장
declare global {
  var apiCallHistory: Map<string, number[]> | undefined;
}

export default defineEventHandler(async (event): Promise<ChatAPIResponse> => {
  try {
    // 🛡️ 보안 체크 1: HTTP Method 검증
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // 🛡️ 보안 체크 2: Origin/Referer 검증 (CSRF 방지)
    const origin = getHeader(event, 'origin')
    const host = getHeader(event, 'host')
    
    // 개발 환경에서는 localhost 허용, 프로덕션에서는 도메인 제한
    const isDev = process.env.NODE_ENV === 'development'
    const allowedOrigins = isDev 
      ? ['http://localhost:3000', `http://${host}`, `https://${host}`]
      : [`https://${host}`, 'https://vue-nuxt-word-game.vercel.app'] // Vercel 배포 도메인
    
    if (!isDev && origin && !allowedOrigins.includes(origin)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Invalid Origin'
      })
    }

    // 🛡️ 보안 체크 3: 지능적인 레이트 리미팅
    // 클라이언트 IP 가져오기 (Nuxt 3 방식)
    const clientIP: string = getHeader(event, 'x-forwarded-for') || 
                             getHeader(event, 'x-real-ip') || 
                             event.node.req.socket?.remoteAddress || 
                             'unknown'
    
    const now: number = Date.now()
    
    const rateLimitWindows: RateLimitWindows = {
      // 단기: 1분에 20번 (버스트 허용)
      short: { window: 60 * 1000, maxRequests: 20 },
      // 중기: 10분에 100번 (지속적 사용 허용)  
      medium: { window: 10 * 60 * 1000, maxRequests: 100 },
      // 장기: 1시간에 300번 (남용 방지)
      long: { window: 60 * 60 * 1000, maxRequests: 300 }
    }
    
    // 간단한 메모리 기반 레이트 리미팅 (실제로는 Redis 사용 권장)
    global.apiCallHistory = global.apiCallHistory || new Map<string, number[]>()
    const userHistory: number[] = global.apiCallHistory.get(clientIP) || []
    
    // 각 시간 윈도우별로 체크
    let blocked: boolean = false
    let blockReason: string = ''
    
    for (const [level, config] of Object.entries(rateLimitWindows)) {
      const recentRequests = userHistory.filter(
        timestamp => now - timestamp < config.window
      )
      
      if (recentRequests.length >= config.maxRequests) {
        blocked = true
        blockReason = `Too many requests in ${level} window (${recentRequests.length}/${config.maxRequests})`
        break
      }
    }
    
    if (blocked) {
      console.warn(`Rate limit exceeded for IP ${clientIP}: ${blockReason}`)
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests - Please try again later'
      })
    }
    
    // 현재 요청 기록 (최근 1시간만 보관하여 메모리 절약)
    const oneHourAgo = now - (60 * 60 * 1000)
    const cleanedHistory = userHistory.filter(timestamp => timestamp > oneHourAgo)
    cleanedHistory.push(now)
    global.apiCallHistory.set(clientIP, cleanedHistory)

    // 🛡️ 보안 체크 4: 유연한 입력값 검증
    const body: ChatRequestBody = await readBody(event)
    const { message }: { message: string } = body

    if (!message || typeof message !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: message is required'
      })
    }

    // 메시지 길이 제한을 더 관대하게 (게임 특성상 긴 질문 가능)
    if (message.length > 2000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: message too long (max 2000 characters)'
      })
    }

    // 🛡️ 보안 체크 5: 의심스러운 패턴 감지
    const suspiciousPatterns = [
      /sql|select|insert|update|delete|drop|union/i, // SQL Injection 시도
      /script|javascript|eval|alert/i, // XSS 시도
      /<.*?>/g, // HTML 태그 (기본적인 방어)
      /\.(exe|bat|sh|php|jsp)$/i // 파일 업로드 시도
    ]
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(message))
    
    if (isSuspicious) {
      console.warn(`Suspicious request detected from IP ${clientIP}: ${message.substring(0, 100)}...`)
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Invalid content detected'
      })
    }

    // 🛡️ 보안 체크 6: API 키 존재 여부 확인
    if (!process.env.OPENAI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error: API key not configured'
      })
    }

    // ChatGPT API 호출
    const response: Response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: message
          }
        ],
        max_tokens: 100, // 토큰 수 제한으로 비용 절약
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `ChatGPT API 오류: ${response.status}`
      })
    }

    const data: OpenAIResponse = await response.json()
    
    return {
      success: true,
      message: data.choices[0].message.content,
      usage: data.usage
    }
  } catch (error: unknown) {
    console.error('ChatGPT API 호출 실패:', error)
    
    // 보안상 민감한 정보는 로그에만 남기고 클라이언트에는 일반적인 메시지만 전송
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error // createError로 만든 에러는 그대로 전달
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
}) 