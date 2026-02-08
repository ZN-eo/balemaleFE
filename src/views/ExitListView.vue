<template>
  <div class="exit-list-container">
    <!-- 중간 섹션 (주차장 맵) -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 (차량 카드 리스트) -->
    <div class="bottom-section">
      <div class="bottom-section__fit">
      <div class="list-panel" :class="{ 'is-empty': loading || !!errorMessage || cars.length === 0 }">
        <LoadingPanel v-if="loading" />
        <div v-else-if="errorMessage" class="empty-panel">
          <div class="empty-text error">{{ errorMessage }}</div>
        </div>
        <div v-else-if="cars.length === 0" class="empty-panel">
          <div class="empty-text error">일치하는 차량이 없습니다</div>
        </div>

        <div v-else class="card-list">
          <button
            v-for="car in cars"
            :key="car.vehicleId"
            type="button"
            class="car-card"
            @click="selectCar(car)"
          >
            <span class="car-plate">{{ car.plate }}</span>
            <svg
              v-if="car.isDisabled"
              class="disabled-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              role="img"
              aria-label="장애인"
            >
              <path
                d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM680-80v-200H480q-33 0-56.5-23.5T400-360v-240q0-33 23.5-56.5T480-680q24 0 41.5 10.5T559-636q55 66 99.5 90.5T760-520v80q-53 0-107-23t-93-55v138h120q33 0 56.5 23.5T760-300v220h-80Zm-280 0q-83 0-141.5-58.5T200-280q0-72 45.5-127T360-476v82q-35 14-57.5 44.5T280-280q0 50 35 85t85 35q39 0 69.5-22.5T514-240h82q-14 69-69 114.5T400-80Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <button type="button" class="prev-btn" @click="goBack">이전</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import LoadingPanel from '@/components/LoadingPanel.vue'
import { getRegisterCars } from '@/api/modules/public'

export default {
  name: 'ExitListView',
  components: {
    ParkingMap,
    LoadingPanel
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const cars = ref([])
    const loading = ref(true)
    const errorMessage = ref('')

    const vehicleFourNumberRaw = route.query.vehicleFourNumber
    const vehicleFourNumber =
      Array.isArray(vehicleFourNumberRaw) ? vehicleFourNumberRaw[0] : vehicleFourNumberRaw

    const fetchCars = async () => {
      loading.value = true
      errorMessage.value = ''
      try {
        if (!vehicleFourNumber || String(vehicleFourNumber).length !== 4) {
          cars.value = []
          errorMessage.value = '차량 번호 4자리를 다시 입력해주세요.'
          return
        }

        const response = await getRegisterCars(String(vehicleFourNumber))
        cars.value = response?.data?.data ?? []
      } catch (e) {
        cars.value = []
        errorMessage.value = '차량 목록 조회에 실패했습니다.'
        if (import.meta.env.DEV) console.warn(e)
      } finally {
        loading.value = false
      }
    }

    const selectCar = (car) => {
      // vehicleId, vehicleFourNumber + RegisterCar.status(문구 판단용) 전달
      router.push({
        path: '/exit/payment',
        query: { vehicleId: car.vehicleId, vehicleFourNumber },
        state: { registerCarStatus: car.status }
      })
    }

    const goBack = () => {
      router.push({
        path: '/select',
        query: { vehicleFourNumber }
      })
    }

    onMounted(() => {
      fetchCars()
    })

    return {
      cars,
      loading,
      errorMessage,
      selectCar,
      goBack
    }
  }
}
</script>

<style scoped>
.exit-list-container {
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.car-plate {
  text-align: center;
}
.car-card .disabled-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  color: var(--color-teal);
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
  .exit-list-container {
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
