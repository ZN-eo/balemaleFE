import { subscribe, unsubscribe } from '@/api/websocket/stompClient'

export type PaymentStatus = 'READY' | 'PAID' | 'FAILED'

export type PaymentData = {
  paymentId: string
  paid: number // Integer는 TypeScript에서 number로 처리합니다.
  paymentStatus: PaymentStatus
  reasonMessage: string | null
}

export type RobotEventType =
  | 'WAITING'
  | 'LOADING'
  | 'DRIVING_DESTINATION'
  | 'DRIVING_HOME'
  | 'ESTOP'
  | 'PARKING'
  | 'FAILED'

export type RobotEventData = {
  robotId: string
  plate: string
  robotEventType: RobotEventType
}

export const subscribePaymentStatus = (handler: (e: PaymentData) => void) =>
  subscribe('payment-status', '/topic/payment', handler)

export const unsubscribePaymentStatus = () => unsubscribe('payment-status')

export const subscribeRobotEvent = (handler: (e: RobotEventData) => void) =>
  subscribe('robot-event', '/topic/robot-events', handler) // 주소 확인 필요

export const unsubscribeRobotEvent = () => unsubscribe('robot-event')
