<template>
  <div class="entry-list-container">
    <!-- 중간 섹션 (주차장 맵) -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 (차량 카드 리스트) -->
    <div class="bottom-section">
      <div class="bottom-section__fit">
      <div class="list-panel" :class="{ 'is-empty': cars.length === 0 }">
        <div v-if="cars.length === 0" class="empty-panel">
          <div class="empty-text error">등록 대기 차량이 없습니다</div>
        </div>

        <div v-else class="card-list">
          <button
            v-for="(car, idx) in cars"
            :key="`${car.plate}-${idx}`"
            type="button"
            class="car-card"
            :class="{ 'is-disabled-car': car.isDisabled }"
            @click="selectCar(car)"
          >
            <span class="car-plate">{{ car.plate }}</span>
            <span v-if="car.isDisabled" class="disabled-badge">장애인</span>
          </button>
        </div>
      </div>

      <button type="button" class="prev-btn" @click="goBack">이전</button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import { getOcrDetections } from '@/api/modules/parking'

export default {
  name: 'EntryListView',
  components: {
    ParkingMap
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const vehicleFourNumberRaw = route.query.vehicleFourNumber
    const vehicleFourNumber =
      Array.isArray(vehicleFourNumberRaw) ? vehicleFourNumberRaw[0] : vehicleFourNumberRaw

    const cars = ref([])

    /** 번호판 문자열에서 숫자만 추출한 뒤 마지막 4자리 반환 (뒷번호 4자리) */
    const lastFourDigits = (plate) => {
      const digits = (plate ?? '').toString().replace(/\D/g, '')
      return digits.length >= 4 ? digits.slice(-4) : ''
    }

    const fetchOcrList = async () => {
      const four = vehicleFourNumber != null ? String(vehicleFourNumber).trim() : ''
      if (four.length !== 4) {
        cars.value = []
        return
      }
      try {
        const res = await getOcrDetections()
        const list = res?.data?.data ?? res?.data ?? []
        const items = Array.isArray(list) ? list : []
        cars.value = items.filter(
          (item) => item?.plate && lastFourDigits(item.plate) === four
        )
      } catch (e) {
        if (import.meta.env.DEV) console.warn('OCR 목록 조회 실패:', e)
        cars.value = []
      }
    }

    const selectCar = (car) => {
      router.push({
        path: '/entry/register',
        query: { plate: car.plate },
        state: {
          ocrDetection: {
            plate: (car.plate ?? '').toString().trim(),
            isDisabled: car.isDisabled ?? false
          }
        }
      })
    }

    const goBack = () => {
      router.push({
        path: '/select',
        query: vehicleFourNumber ? { vehicleFourNumber } : {}
      })
    }

    onMounted(() => {
      fetchOcrList()
    })

    return {
      cars,
      selectCar,
      goBack
    }
  }
}
</script>

<style scoped>
.entry-list-container {
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

.list-panel {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.list-panel.is-empty {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.empty-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  min-height: 0;
}

.empty-text {
  text-align: center;
  font-size: clamp(22px, 5vw, 40px);
  font-weight: 800;
  letter-spacing: 0.18em;
  color: var(--text-primary);
}

.empty-text.error {
  color: var(--color-error);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.car-card {
  width: min(1104px, 98%);
  height: 75px;
  border: 2px solid var(--border-light);
  background: var(--bg-card);
  padding: 4px 20px;
  font-size: 35px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--text-primary);
  cursor: pointer;
  box-sizing: border-box;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.car-card:hover {
  border-color: var(--color-teal-light);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
}
.car-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.car-plate {
  flex: 1;
  text-align: left;
}
.car-card.is-disabled-car .disabled-badge {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-teal);
  background: rgba(20, 184, 166, 0.15);
  padding: 4px 10px;
  border-radius: var(--radius-btn);
}

.prev-btn {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 2px solid var(--border-light);
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-btn);
  box-sizing: border-box;
  box-shadow: var(--shadow-card);
}
.prev-btn:hover {
  border-color: var(--color-teal-light);
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

  .list-panel {
    padding: 12px;
  }

  .car-card {
    padding: 4px 20px;
    font-size: 35px;
  }

  .prev-btn {
    padding: 10px 20px;
    font-size: 14px;
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

  .list-panel {
    padding: 16px;
  }

  .car-card {
    padding: 4px 20px;
    font-size: 35px;
  }

  .prev-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) — HomeView section 크기 통일 */
@media (min-width: 769px) {
  .entry-list-container {
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

  .list-panel {
    padding: 24px;
  }

  .car-card {
    padding: 4px 20px;
    font-size: 35px;
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }
}
</style>
