// 공용 응답 구조
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

export interface Car {
  mapId?: number
  plateNumber: string
}

//관리자 응답 구조
export interface AdminResponse<T> {
  data: T
  message: string
  status: number
}

export interface AnomalyData {
  targetName: string
  timestamp: string
  description: string
}
