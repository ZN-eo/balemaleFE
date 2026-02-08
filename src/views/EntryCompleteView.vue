<template>
  <div class="entry-complete-container">
    <div class="middle-section">
      <ParkingMap
        :initial-map-data="parkingMapData"
        :highlighted-slot-code="highlightedSlotCode"
        highlight-variant="teal"
      />
    </div>
    <div class="bottom-section">
      <div class="bottom-section__fit">
      <LoadingPanel v-if="loading" />
      <div v-else class="complete-panel">
        <div class="plate-box">{{ formattedPlate }}</div>
        <div class="complete-title">등록완료!</div>
        <div class="complete-desc">입차 등록이 완료되었습니다</div>
      </div>

      <div class="action-bar">
        <button type="button" class="home-btn" @click="goHome">처음으로</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import LoadingPanel from '@/components/LoadingPanel.vue'
import { getParkedCars } from '@/api/modules/public'
import { useParkingMapStore } from '@/stores/parkingMapStore'

// slotId → nodeCode: 1–4 A1~A4, 5–8 B1~B4, 9–12 C1~C4
const slotIdToNodeCode = (id) => {
  const map = { 1: 'A1', 2: 'A2', 3: 'A3', 4: 'A4', 5: 'B1', 6: 'B2', 7: 'B3', 8: 'B4', 9: 'C1', 10: 'C2', 11: 'C3', 12: 'C4' }
  return map[id] ?? null
}

export default {
  name: 'EntryCompleteView',
  components: {
    ParkingMap,
    LoadingPanel
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const parkingMapStore = useParkingMapStore()
    const loading = ref(false)

    // state 맵 데이터 우선 사용, 없으면 store 맵 + query.slot 또는 assignedSlotId로 배정 슬롯 OCCUPIED 표시
    const parkingMapData = computed(() => {
      const fromState = history.state?.parkingMapData
      if (Array.isArray(fromState) && fromState.length >= 12) return fromState

      const storeMap = parkingMapStore.mapData
      if (!Array.isArray(storeMap) || storeMap.length < 12) return storeMap

      const slotId = history.state?.assignedSlotId ?? null
      const slotCode = route.query.slot ?? history.state?.assignedSlotCode ?? (slotId ? slotIdToNodeCode(slotId) : null)
      if (!slotId && !slotCode) return storeMap

      const sid = slotId != null ? Number(slotId) : null
      const codeNorm = slotCode ? String(slotCode).trim().toUpperCase().replace(/-/g, '') : ''
      return storeMap.map((s) => {
        if (sid != null && sid >= 1 && sid <= 12 && Number(s?.slotId) === sid) return { ...s, slotStatus: 'OCCUPIED' }
        if (codeNorm && (s?.nodeCode ?? '').toString().trim().toUpperCase().replace(/-/g, '') === codeNorm) return { ...s, slotStatus: 'OCCUPIED' }
        return s
      })
    })

    const highlightedSlotCode = computed(() => {
      const fromState = history.state?.assignedSlotCode
      if (fromState) return fromState
      const slotRaw = route.query.slot
      const slotFromQuery = Array.isArray(slotRaw) ? slotRaw[0] : slotRaw
      if (slotFromQuery) return String(slotFromQuery).trim().toUpperCase()
      const sid = history.state?.assignedSlotId
      return sid != null ? slotIdToNodeCode(sid) : null
    })

    // 우선순위: query.plate(즉시 표출) → query.vehicleId로 백엔드 조회 후 plate 세팅
    const plateRaw = route.query.plate
    const plateFromQuery = Array.isArray(plateRaw) ? plateRaw[0] : plateRaw
    const plate = ref((plateFromQuery ?? '').toString())

    const vehicleIdRaw = route.query.vehicleId
    const vehicleIdValue = Array.isArray(vehicleIdRaw) ? vehicleIdRaw[0] : vehicleIdRaw

    const fetchPlateByVehicleId = async () => {
      const parsed = Number(vehicleIdValue)
      if (!Number.isFinite(parsed)) return

      try {
        const res = await getParkedCars(parsed)
        const data = res?.data?.data
        const parked = Array.isArray(data) ? data[0] : data
        if (parked?.plate) plate.value = parked.plate
      } catch (e) {
        if (import.meta.env.DEV) console.warn('차량번호 조회 실패:', e)
      }
    }

    const formattedPlate = computed(() => {
      const v = (plate.value ?? '').toString().trim()
      return v ? v.split('').join(' ') : ''
    })

    onMounted(async () => {
      const needsPlateFetch = !plate.value
      const hasSlotFromQuery = route.query.slot
      const hasMapFromState = Array.isArray(history.state?.parkingMapData) && history.state.parkingMapData.length >= 12
      const needsMapFetch = hasSlotFromQuery && !hasMapFromState
      if (needsPlateFetch || needsMapFetch) {
        loading.value = true
        try {
          if (needsPlateFetch) await fetchPlateByVehicleId()
          if (needsMapFetch) await parkingMapStore.fetchParkingMap()
        } finally {
          loading.value = false
        }
      }
    })

    const goHome = () => {
      router.push('/')
    }

    return { formattedPlate, goHome, loading, parkingMapData, highlightedSlotCode }
  }
}
</script>

<style scoped>
.entry-complete-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background: var(--bg-page);
}

/* HomeView 기준: middle-section 비율 통일 */
.top-section {
  flex: 0 0 auto;
  padding: 1.625rem 0 0 4.375rem;
  width: 100%;
  box-sizing: border-box;
}

.robot-status {
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  padding: 1.25rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  color: var(--color-teal);
  font-weight: 700;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.middle-section {
  flex: 1 1 0;
  min-height: 0;
  padding: 0 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

.bottom-section {
  flex: 0 0 auto;
  width: 100%;
  height: 500px;
  min-height: 500px;
  margin: 0 auto;
  padding: 0.5rem 0.625rem 0.625rem 0.625rem;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: flex-end;
}

.complete-panel {
  width: 100%;
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  box-sizing: border-box;
  padding: clamp(28px, 6vw, 56px) clamp(16px, 4vw, 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 4vw, 28px);
}

.plate-box {
  width: min(520px, 100%);
  border: 2px solid var(--color-teal-light);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  height: 60px;
  padding: 0 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: clamp(30px, 7.5vw, 48px);
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.complete-title {
  color: var(--color-teal);
  font-weight: 800;
  font-size: clamp(33px, 7vw, 48px);
}

.complete-desc {
  color: var(--color-teal-light);
  font-weight: 700;
  font-size: clamp(24px, 5.75vw, 36px);
  letter-spacing: 0.12em;
  text-align: center;
}

.action-bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.home-btn {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-btn);
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
}
.home-btn:hover {
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.45);
}

/* 모바일 (480px 이하) — HomeView section 크기 통일 */
@media (max-width: 480px) {
  .top-section {
    padding: 1.25rem 0 0 0.75rem;
  }

  .robot-status {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .middle-section {
    padding: 0 0.75rem;
    gap: 0;
  }

  .bottom-section {
    padding: 0.5rem 0.75rem 0.75rem 0.75rem;
    gap: 0.75rem;
    justify-content: space-between;
  }
}

/* 태블릿 (481px ~ 768px) — HomeView section 크기 통일 */
@media (min-width: 481px) and (max-width: 768px) {
  .top-section {
    padding: 1.4375rem 0 0 1rem;
  }

  .robot-status {
    padding: 1rem;
  }

  .middle-section {
    padding: 0 1rem;
  }

  .bottom-section {
    padding: 0.5rem 1rem 1rem 1rem;
    gap: 0.875rem;
    justify-content: space-between;
  }
}

/* 데스크톱 (769px 이상) — HomeView section 크기 통일 */
@media (min-width: 769px) {
  .entry-complete-container {
    max-width: 75rem;
    margin: 0 auto;
  }

  .top-section {
    padding: 1.625rem 0 0 1.5rem;
  }

  .robot-status {
    padding: 1.5rem;
    font-size: 1.125rem;
  }

  .middle-section {
    padding: 0 1.5rem;
  }

  .bottom-section {
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
    gap: 1.125rem;
    justify-content: space-between;
  }
}
</style>
