<template>
  <div class="entry-list-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 - 주차장 맵 -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 -->
    <div class="bottom-section">
      <div class="list-panel" :class="{ 'is-empty': loading || !!errorMessage || cars.length === 0 }">
        <div v-if="loading" class="empty-panel">
          <div class="empty-text">조회 중...</div>
        </div>
        <div v-else-if="errorMessage" class="empty-panel">
          <div class="empty-text error">{{ errorMessage }}</div>
        </div>
        <div v-else-if="cars.length === 0" class="empty-panel">
          <div class="empty-text error">일치하는 차량이 없습니다</div>
        </div>

        <div v-else class="card-list">
          <button
            v-for="(car, index) in cars"
            :key="car.vehicleId || index"
            type="button"
            class="car-card"
            @click="selectCar(car)"
          >
            {{ car.plate }}
          </button>
        </div>
      </div>

      <button type="button" class="prev-btn" @click="goBack">이전</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import { getRegisterCars } from '@/api/modules/public'

export default {
  name: 'EntryListView',
  components: {
    ParkingMap
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
      } catch (error) {
        cars.value = []
        errorMessage.value = '차량 목록 조회에 실패했습니다.'
        if (import.meta.env.DEV) {
          console.warn('차량 목록 조회 실패:', error)
        }
      } finally {
        loading.value = false
      }
    }

    const selectCar = (car) => {
      router.push({
        path: '/entry/register',
        query: { vehicleId: car.vehicleId }
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
.entry-list-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: #1B4300;
}

.top-section {
  padding: 20px;
  padding-top: 80px;
  padding-left: 70px;
  padding-bottom: 0;
  width: 100%;
  box-sizing: border-box;
}

.robot-status {
  border: 1px solid #000;
  background: #fff;
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  color: #000;
}

.middle-section {
  flex: 0 0 auto;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  min-height: auto;
}

.bottom-section {
  flex: 1;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 0;
}

.complete-panel {
  width: 100%;
  border: 1px solid #000;
  background: #fff;
  padding: 4px 20px;
  font-size: 45px;
  font-weight: 700;
  letter-spacing: 0.3em;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 12px;
}

.list-panel {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* 조회중/에러/0건일 때만 큰 흰 패널로 표시 */
.list-panel.is-empty {
  background: #fff;
  border-radius: 8px;
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
  color: #000;
}

.empty-text.error {
  color: #d32f2f;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

/* 차량번호 카드(버튼) = EntryCompleteView의 plate-box 느낌 */
.car-card {
  width: 100%;
  border: 1px solid #000;
  background: #fff;
  padding: 4px 20px;
  font-size: 45px;
  font-weight: 700;
  letter-spacing: 0.3em;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 12px;
}

.prev-btn {
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 12px;
  box-sizing: border-box;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .top-section {
    padding: 12px;
    padding-top: 64px;
    padding-left: 12px;
    padding-bottom: 0;
  }

  .robot-status {
    padding: 12px;
    font-size: 14px;
  }

  .middle-section {
    padding: 0 12px;
    gap: 0;
  }

  .bottom-section {
    padding: 12px;
    gap: 12px;
    justify-content: space-between;
  }
  .list-panel {
    padding: 12px;
  }

  .prev-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .top-section {
    padding: 16px;
    padding-top: 72px;
    padding-left: 16px;
    padding-bottom: 0;
  }

  .robot-status {
    padding: 16px;
  }

  .middle-section {
    padding: 0 16px;
  }

  .bottom-section {
    padding: 16px;
    gap: 14px;
    justify-content: space-between;
  }
  .list-panel {
    padding: 16px;
  }

  .prev-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .entry-list-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .top-section {
    padding: 24px;
    padding-top: 96px;
    padding-left: 24px;
    padding-bottom: 0;
  }

  .robot-status {
    padding: 24px;
    font-size: 18px;
  }

  .middle-section {
    padding: 0 24px;
  }

  .bottom-section {
    padding: 24px;
    gap: 18px;
    justify-content: space-between;
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }

  .list-panel {
    padding: 24px;
  }
}
</style>
