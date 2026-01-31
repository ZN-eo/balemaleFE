import { publicInstance } from '../index'
import type {
  ApiResponse,
  Car,
  ParkedCar,
  RegisterCar,
  AvailableParkingCount,
  ParkingMapSlot
} from '../types'

// 차량 목록 조회 api 호출
export const getCars = () => {
  return publicInstance.get<ApiResponse<Car[]>>('/cars')
}

// 차량 등록 api 호출
export const registerCar = (newCar: Car) => {
  return publicInstance.post<ApiResponse<Car>>('/cars', newCar)
}

// 출차할(주차완료된) 차량 상세 조회 api 호출 # url 변경 완료
export const getParkedCars = (vehicleId: number) => {
  return publicInstance.get<ApiResponse<ParkedCar[]>>('/parking/vehicle', {
    params: { vehicleId }
  })
}

// 조회/출차 버튼 클릭시 등록된된 차량 목록 조회 api 호출 # url 변경 완료
export const getRegisterCars = (vehicleFourNumber: string) => {
  return publicInstance.get<ApiResponse<RegisterCar[]>>('/parking/register-vehicles', {
    params: { vehicleFourNumber }
  })
}

// 차량 가능 잔여수 조회 api 호출 # url 변경 완료
export const getAvailableParkingCount = () => {
  return publicInstance.get<ApiResponse<AvailableParkingCount>>('/parking/remaining-number')
}

// 주차장 맵 데이터 조회 (모든 주차칸 정보, slotId 오름차순)
export const getParkingMap = () => {
  return publicInstance.get<ApiResponse<ParkingMapSlot[]>>('/parking/map')
}