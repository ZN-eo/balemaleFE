import { Client } from '@stomp/stompjs'
import type { StompSubscription } from '@stomp/stompjs'

type Handler<T> = (payload: T) => void

/**
 * client: STOMP 연결을 수행하는 인스턴스 (앱 전체에서 하나만 유지)
 * connectPromise: 연결 시도 중이면 같은 Promise 공유 (중복 연결 방지)
 * subscriptions: key로 구독 관리 (중복 구독/해제 관리)
 */

let client: Client | null = null
let connectPromise: Promise<void> | null = null
const subscriptions = new Map<string, StompSubscription>()

export const connect = (): Promise<void> => {
  // 이미 연결되어 있으면 재사용
  if (client?.connected) return Promise.resolve()

  // 이미 연결 시도 중이면 Promise 공유 (중복 연결 방지)
  if (connectPromise) return connectPromise

  /**
   * STOMP 클라이언트 생성 (WebSocket 기반)
   * - brokerURL: WS 접속 주소
   * - reconnectDelay: 연결이 끊기면 5초 후 자동 재연결
   */
  client = new Client({
    brokerURL: import.meta.env.VITE_SOCKET_URL,
    reconnectDelay: 5000,
    debug: (str) => console.log(str)
  })
  console.log(client)

  /**
   * STOMP 연결 결과를 Promise로 감싼다
   * - onConnect: 연결 성공 → resolve
   * - onStompError / onWebSocketError: 연결 실패 → reject
   */
  connectPromise = new Promise<void>((resolve, reject) => {
    client!.onConnect = () => resolve()

    client!.onStompError = (frame) => {
      connectPromise = null
      reject(new Error(frame.headers['message'] || 'STOMP error'))
    }

    client!.onWebSocketError = () => {
      connectPromise = null
      reject(new Error('WebSocket error'))
    }
  })

  client.activate()
  return connectPromise
}

/**
 * STOMP(WebSocket) 연결 종료
 * - 등록된 모든 구독 해제
 * - STOMP 클라이언트 비활성화
 * - 내부 상태 초기화
 */
export const disconnect = () => {
  subscriptions.forEach((sub) => sub.unsubscribe())
  subscriptions.clear()

  client?.deactivate()
  client = null
  connectPromise = null
}

/** 현재 STOMP 연결 상태 확인 */
export const isConnected = () => !!client?.connected

/**
 * 서버로 STOMP 메시지 전송
 * - 연결이 없으면 자동으로 connect() 수행
 */
export const publish = async <T>(destination: string, body: T) => {
  await connect()
  if (!client?.connected) throw new Error('STOMP not connected')

  client.publish({
    destination,
    body: JSON.stringify(body)
  })
}

/**
 * STOMP 구독 등록
 * - key 기준으로 중복 구독 방지
 */
export const subscribe = async <T>(key: string, destination: string, handler: Handler<T>) => {
  await connect()
  if (!client?.connected) throw new Error('STOMP not connected')

  // 동일 key로 이미 구독 중이면 해제 후 재구독 (중복 수신 방지)
  subscriptions.get(key)?.unsubscribe()

  const sub = client.subscribe(destination, (msg) => {
    try {
      handler(JSON.parse(msg.body))
    } catch {
      handler(msg.body as unknown as T)
    }
  })

  subscriptions.set(key, sub)
  console.log(subscriptions)
  return sub
}

/** key에 해당하는 구독 해제 */
export const unsubscribe = (key: string) => {
  subscriptions.get(key)?.unsubscribe()
  subscriptions.delete(key)
}
