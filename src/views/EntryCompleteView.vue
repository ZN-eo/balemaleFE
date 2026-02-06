<template>
  <div class="entry-complete-container">
    <div class="middle-section">
      <ParkingMap
        :initial-map-data="parkingMapData"
        :highlighted-slot-code="highlightedSlotCode"
      />
    </div>
    <div class="bottom-section">
      <div class="bottom-section__fit">
      <div class="complete-panel">
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
import { getParkedCars } from '@/api/modules/public'
import { useParkingMapStore } from '@/stores/parkingMapStore'

export default {
  name: 'EntryCompleteView',
  components: {
    ParkingMap
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const parkingMapStore = useParkingMapStore()
    const parkingMapData = computed(
      () => history.state?.parkingMapData ?? parkingMapStore.mapData ?? null
    )
    const highlightedSlotCode = history.state?.assignedSlotCode ?? null

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

    onMounted(() => {
      if (!plate.value) fetchPlateByVehicleId()
    })

    const goHome = () => {
      router.push('/')
    }

    return { formattedPlate, goHome, parkingMapData, highlightedSlotCode }
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
  font-size: clamp(20px, 5vw, 32px);
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.complete-title {
  color: var(--color-teal);
  font-weight: 800;
  font-size: clamp(22px, 6vw, 40px);
}

.complete-desc {
  color: var(--color-teal-light);
  font-weight: 700;
  font-size: clamp(16px, 4.5vw, 28px);
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
