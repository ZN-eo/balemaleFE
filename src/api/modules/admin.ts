import { adminInstance } from '../index'
import type { AdminResponse, AnomalyData } from '../types'

export const getAnomalies = () => {
  return adminInstance.get<AdminResponse<AnomalyData[]>>('/admin/anomalies')
}
