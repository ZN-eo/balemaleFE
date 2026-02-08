<template>
  <div class="entry-register-container">
    <div class="middle-section">
      <ParkingMap />
    </div>
    <div class="bottom-section">
      <div class="bottom-section__fit">
      <div class="content-wrap">
        <LoadingPanel v-if="loading" />
        <div v-else class="complete-panel">
          <div class="plate-box">{{ formattedPlate }}</div>
          <div class="entry-title">입 차 를 진 행 합 니 다</div>
          <div class="entry-warning">※ 주차완료 전까지 출차 불가</div>
        </div>
      </div>

      <div class="action-bar">
        <button type="button" class="prev-btn" @click="goBack">이전</button>
        <button type="button" class="enter-btn" @click="enter">입차하기</button>
      </div>
      </div>
    </div>

    <!-- 만차 모달 (404) -->
    <div v-if="showFullModal" class="modal-overlay" @click.self="closeFullModal">
      <div class="modal-box">
        <p class="modal-message">만차 : 주차가 불가합니다</p>
        <button type="button" class="modal-confirm-btn" @click="closeFullModal">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import ParkingMap from '@/components/ParkingMap.vue'
import LoadingPanel from '@/components/LoadingPanel.vue'
import { registerVehicleWithOcr } from '@/api/modules/parking'
import { getParkedCars } from '@/api/modules/public'
import { useParkingMapStore } from '@/stores/parkingMapStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'EntryRegisterView',
  components: {
    ParkingMap,
    LoadingPanel
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const plateRaw = route.query.plate
    const plateFromQuery = Array.isArray(plateRaw) ? plateRaw[0] : plateRaw
    const plate = ref((plateFromQuery ?? '').toString())

    const vehicleIdRaw = route.query.vehicleId
    const vehicleIdValue = Array.isArray(vehicleIdRaw) ? vehicleIdRaw[0] : vehicleIdRaw

    // EntryListView에서 선택한 OcrDetection (state로 전달) 또는 plate만 있을 때 기본값으로 구성
    const getOcrDetection = () => {
      const fromState = history.state?.ocrDetection
      if (fromState?.plate) {
        return {
          plate: fromState.plate.trim(),
          entryAt: fromState.entryAt ?? new Date().toISOString(),
          isDisabled: fromState.isDisabled ?? false
        }
      }
      const p = (plate.value ?? '').toString().trim()
      return {
        plate: p,
        entryAt: new Date().toISOString(),
        isDisabled: false
      }
    }

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

    const goBack = () => {
      router.go(-1)
    }

    const showFullModal = ref(false)
    const loading = ref(false)

    const closeFullModal = () => {
      showFullModal.value = false
      router.push('/')
    }

    const enter = async () => {
      const ocrDetection = getOcrDetection()
      if (!ocrDetection.plate?.trim()) {
        alert('차량 번호를 확인해주세요.')
        return
      }
      loading.value = true
      try {
        const res = await registerVehicleWithOcr(ocrDetection)
        if (import.meta.env.DEV) console.log('입차 등록 응답 코드:', res.status)
        const result = res?.data?.data ?? res?.data
        const resultPlate = result?.plate ?? plate.value
        const resultSlotId = result?.slotId != null ? Number(result.slotId) : null
        // slotId → nodeCode: 1–4 A1~A4, 5–8 B1~B4, 9–12 C1~C4
        const slotIdToNodeCode = (id) => {
          const map = { 1: 'A1', 2: 'A2', 3: 'A3', 4: 'A4', 5: 'B1', 6: 'B2', 7: 'B3', 8: 'B4', 9: 'C1', 10: 'C2', 11: 'C3', 12: 'C4' }
          return map[id] ?? null
        }
        const assignedSlotCode = resultSlotId ? slotIdToNodeCode(resultSlotId) : (result?.nodeCode ?? null)

        await useParkingMapStore().fetchParkingMap()
        const parkingMapStore = useParkingMapStore()
        // AddVehicleResult.slotId로 배정 슬롯을 OCCUPIED로 표시 (백엔드 갱신 지연 대비)
        let mapDataToPass = parkingMapStore.mapData
        if (resultSlotId != null && resultSlotId >= 1 && resultSlotId <= 12 && Array.isArray(mapDataToPass) && mapDataToPass.length >= 12) {
          mapDataToPass = mapDataToPass.map((slot) =>
            Number(slot?.slotId) === resultSlotId ? { ...slot, slotStatus: 'OCCUPIED' } : slot
          )
        }
        router.push({
          path: '/entry/complete',
          query: {
            ...(resultPlate ? { plate: resultPlate } : {}),
            ...(assignedSlotCode ? { slot: assignedSlotCode } : {})
          },
          state: {
            parkingMapData: mapDataToPass,
            assignedSlotCode,
            assignedSlotId: resultSlotId
          }
        })
      } catch (e) {
        const status = e?.response?.status
        if (import.meta.env.DEV) console.log('입차 등록 응답 코드:', status)
        if (status === 404) {
          showFullModal.value = true
          return
        }
        if (import.meta.env.DEV) console.warn('입차 등록 실패:', e)
        alert('입차 등록에 실패했습니다. 다시 시도해주세요.')
      } finally {
        loading.value = false
      }
    }

    return {
      formattedPlate,
      goBack,
      enter,
      loading,
      showFullModal,
      closeFullModal
    }
  }
}
</script>

<style scoped>
.entry-register-container {
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

.content-wrap {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -1.5rem;
}

.complete-panel {
  width: 100%;
  max-width: min(47.5rem, 100%);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  box-sizing: border-box;
  padding: clamp(1.75rem, 4vh, 3.5rem) clamp(1rem, 2.5vh, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.125rem, 2.5vh, 2.125rem);
}

.plate-box {
  width: min(32.5rem, 100%);
  border: 2px solid var(--color-teal-light);
  border-radius: var(--radius-btn);
  background: var(--bg-card);
  min-height: var(--touch-min-height, 3rem);
  height: 3.75rem;
  padding: 0 1.125rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: clamp(1.5rem, 1.8vh, 1.875rem);
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.entry-title {
  color: var(--color-teal);
  font-weight: 800;
  font-size: clamp(1.6875rem, 2.25vh, 3.75rem);
  letter-spacing: 0.18em;
  text-align: center;
}

.entry-warning {
  color: var(--color-error);
  font-weight: 800;
  font-size: clamp(1.5rem, 1.8vh, 2.25rem);
  letter-spacing: 0.12em;
  text-align: center;
}

.action-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.prev-btn,
.enter-btn {
  min-height: var(--touch-min-height, 3rem);
  padding: 0.75rem 1.5rem;
  font-size: clamp(1rem, 1.2vh, 1.125rem);
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-btn);
  box-sizing: border-box;
}

.prev-btn {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 2px solid var(--border-light);
  box-shadow: var(--shadow-card);
}
.prev-btn:hover {
  border-color: var(--color-teal-light);
}

.enter-btn {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  box-shadow: 0 0.25rem 0.75rem rgba(124, 58, 237, 0.35);
}
.enter-btn:hover {
  box-shadow: 0 0.375rem 1rem rgba(124, 58, 237, 0.45);
}

/* 만차 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 1.75rem 2rem 1.5rem;
  min-width: 17.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.modal-message {
  margin: 0;
  font-size: clamp(1rem, 1.2vh, 1.125rem);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}
.modal-confirm-btn {
  align-self: center;
  min-height: var(--touch-min-height, 3rem);
  margin-top: 0.25rem;
  padding: 0.625rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-btn);
  cursor: pointer;
  box-shadow: 0 0.25rem 0.75rem rgba(124, 58, 237, 0.35);
}
.modal-confirm-btn:hover {
  box-shadow: 0 0.375rem 1rem rgba(124, 58, 237, 0.45);
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
  }

  .bottom-section {
    padding: 0.5rem 0.75rem 0.75rem 0.75rem;
    gap: 0.75rem;
  }

  .content-wrap {
    margin-top: -0.875rem;
  }

  .complete-panel {
    padding: 1.375rem 0.875rem;
  }

  .plate-box {
    font-size: 1.875rem;
  }

  .prev-btn,
  .enter-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
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
  }

  .content-wrap {
    margin-top: -1.125rem;
  }

  .complete-panel {
    padding: 2.125rem 1.125rem;
  }

  .prev-btn,
  .enter-btn {
    padding: 0.6875rem 1.375rem;
    font-size: 0.9375rem;
  }
}

/* 데스크톱 (769px 이상) — HomeView section 크기 통일 */
@media (min-width: 769px) {
  .entry-register-container {
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
  }

  .content-wrap {
    margin-top: -1.375rem;
  }

  .complete-panel {
    padding: 3.5rem 1.5rem;
  }

  .prev-btn,
  .enter-btn {
    padding: 0.875rem 1.75rem;
    font-size: 1.125rem;
  }
}
</style>
