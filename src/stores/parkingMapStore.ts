import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getParkingMap } from '@/api/modules/public'

/** 맵 데이터는 앱 로드·입차하기 성공·정산 성공 시에만 갱신하고, 페이지 이동 시에는 재요청하지 않음 */
export const useParkingMapStore = defineStore('parkingMap', () => {
  const mapData = ref<Array<Record<string, unknown>> | null>(null)

  async function fetchParkingMap() {
    try {
      const res = await getParkingMap()
      const list = res?.data?.data ?? res?.data ?? []
      mapData.value = Array.isArray(list) ? list : null
    } catch (e) {
      if (import.meta.env.DEV) console.warn('주차장 맵 조회 실패:', e)
      mapData.value = null
    }
  }

  return { mapData, fetchParkingMap }
})
