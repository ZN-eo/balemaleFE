// src/stores/map.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { mapStatus } from '@/api/websocket/mapApi'

export const useMapStore = defineStore('map', () => {
  const currentStatus = ref<mapStatus | null>(null)

  // 데이터를 받으면 상태를 업데이트하는 함수
  const setStatus = (data: mapStatus) => {
    currentStatus.value = data
  }

  return { currentStatus, setStatus }
})
