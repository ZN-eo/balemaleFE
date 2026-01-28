// 공용 응답 구조
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

export interface Car {
  vehicleId: number
  plate: string
}

//관리자 응답 구조 
// #TODO: 백엔드 구현 후 수정 필요
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

// 출차할(주차완료된) 차량 상세 조회 응답 구조
export interface ParkedCar {
  vehicleId: number
  plate: string
  entryAt: string
  nodeCode: string
  totalMin: number
  amount: number
  parkedTime: string
}

// 등록 차량 조회(조회/출차) 응답 구조
export interface RegisterCar {
  vehicleId: number
  plate: string
  status: string
}

// 차량 가능 잔여수 조회 api 호출 응답 구조(장애인/일반/총 잔여수)
export interface AvailableParkingCount {
  normalCount: number
  disabledCount: number
  totalCount: number
}
