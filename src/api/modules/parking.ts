import { publicInstance } from '../index'
import type { AddVehicleResult, OcrDetection } from '../types'

/**
 * --- 응답 구조 (OcrDetection) ---
 * OCR로 인식된 번호판 한 건. AI→백엔드 저장·목록 조회·입차등록 body에서 공통 사용.
 * - plate: string - 차량 번호판 (앞뒤·중간 공백은 저장 시 trim 처리) e.g. "12가 3456"
 * - entryAt: string - 입차 시각 (OCR 인식 시점) ISO date-time e.g. "2025-02-02T10:30:00"
 * - isDisabled: boolean - 장애인 차량 여부 (true: 장애인 구역 배정) e.g. false
 */

/**
 * OCR 목록 조회 (Redis)
 * GET /api/v1/parking/ocr-detections
 * Redis에 저장된 OCR 인식 차량 목록을 반환.
 * @returns 응답: OcrDetection[] 또는 { data: OcrDetection[] }
 */
export const getOcrDetections = () => {
  return publicInstance.get<OcrDetection[]>('/parking/ocr-detections')
}

/**
 * (1) OCR 감지 1건 추가
 * POST /api/v1/parking/ocr-detections
 * AI에서 OCR로 인식한 차량 번호 1건을 Redis 목록에 추가. 기존 목록 유지, TTL 갱신.
 * @param body - OcrDetection (plate, entryAt, isDisabled)
 * @returns 응답: OcrDetection 또는 백엔드 공통 래퍼 (data 등)
 */
export const addOcrDetection = (body: OcrDetection) => {
  return publicInstance.post<OcrDetection>('/parking/ocr-detections', body)
}

/**
 * (2) 선택한 OCR 번호로 입차 등록
 * POST /api/v1/parking/vehicle
 * 201: 입차 등록 성공 → AddVehicleResult(slotId, nodeCode, plate)
 * 404: 만차 등으로 주차구역 없음
 * 500: 점유 상태 업데이트 실패
 * @param body - 사용자가 선택한 OcrDetection (plate, entryAt, isDisabled)
 * @returns 응답: AddVehicleResult 또는 { data: AddVehicleResult }
 */
export const registerVehicleWithOcr = (body: OcrDetection) => {
  return publicInstance.post<AddVehicleResult>('/parking/vehicle', body)
}
