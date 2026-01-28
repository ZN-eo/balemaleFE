// 관리자 API 관련 코드 
// #TODO: 백엔드 구현 후 수정 필요
import { adminInstance } from '../index'
import type { AdminResponse, AnomalyData } from '../types'

export const getAnomalies = () => {
  return adminInstance.get<AdminResponse<AnomalyData[]>>('/admin/anomalies')
}
