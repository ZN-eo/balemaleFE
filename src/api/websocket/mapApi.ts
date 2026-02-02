// src/ws/api/robot.ts
import { subscribe, unsubscribe } from '@/api/websocket/stompClient'

export type ParkingSlot = {
  slotId: string | number
  slotCode: string // 예: 'A1', 'B2'
  slotStatus: 'OCCUPIED' | 'EMPTY' | 'UNKNOWN'
  slotType: 'NORMAL' | 'DISABLED'
}

export type mapStatus = ParkingSlot[]

export const subscribeMapStatus = (handler: (e: mapStatus) => void) =>
  subscribe('map-status', '/topic/test', handler)

export const unsubscribeMapStatus = () => unsubscribe('map-status')
