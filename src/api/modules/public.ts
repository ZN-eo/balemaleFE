import { publicInstance } from '../index'
import type { ApiResponse, Car } from '../types'

export const getCars = () => {
  return publicInstance.get<ApiResponse<Car[]>>('/cars')
}

export const registerCar = (newCar: Car) => {
  return publicInstance.post<ApiResponse<Car>>('/cars', newCar)
}
