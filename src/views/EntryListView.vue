<template>
  <div class="entry-list-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 - 주차장 맵 -->
    <div class="middle-section">
      <ParkingMap />
      <div class="card-list">
        <button
          v-for="(car, index) in cars"
          :key="car.vehicleId || index"
          class="car-card"
          @click="selectCar(car)"
        >
          {{ car.plate }}
        </button>
      </div>
    </div>

    <!-- 하단 섹션 -->
    <div class="bottom-section">
      <button @click="goBack" class="prev-btn">이전</button>
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

    const vehicleFourNumberRaw = route.query.vehicleFourNumber
    const vehicleFourNumber =
      Array.isArray(vehicleFourNumberRaw) ? vehicleFourNumberRaw[0] : vehicleFourNumberRaw

    const fetchCars = async () => {
      try {
        if (!vehicleFourNumber || String(vehicleFourNumber).length !== 4) {
          cars.value = []
          return
        }
        const response = await getRegisterCars(String(vehicleFourNumber))
        cars.value = response?.data?.data ?? []
      } catch (error) {
        cars.value = []
        if (import.meta.env.DEV) {
          console.warn('차량 목록 조회 실패:', error)
        }
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
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 0;
  align-items: center;
}

.bottom-section {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}

.card-list {
  width: 66.67%;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
  border-radius: 8px;
}

.car-card {
  width: 100%;
  border: 1px solid #000;
  background: #d9d9d9;
  padding: 18px 16px;
  font-size: 22px;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 12px;
  text-align: left;
}

.prev-btn {
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  box-sizing: border-box;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .top-section {
    padding: 12px;
    padding-top: 64px;
    padding-left: 12px;
  }

  .robot-status {
    padding: 12px;
    font-size: 14px;
  }

  .middle-section {
    padding: 12px;
    gap: 12px;
  }

  .bottom-section {
    padding: 12px;
    gap: 12px;
  }

  .card-list {
    width: 66.67%;
    padding: 12px;
  }

  .car-card {
    padding: 14px 12px;
    font-size: 18px;
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
  }

  .robot-status {
    padding: 16px;
  }

  .middle-section {
    padding: 16px;
  }

  .bottom-section {
    padding: 16px;
    gap: 14px;
  }

  .card-list {
    width: 66.67%;
    padding: 16px;
  }

  .car-card {
    padding: 16px 14px;
    font-size: 20px;
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
  }

  .robot-status {
    padding: 24px;
    font-size: 18px;
  }

  .middle-section {
    padding: 24px;
  }

  .bottom-section {
    padding: 24px;
    gap: 18px;
  }

  .card-list {
    width: 66.67%;
    padding: 24px;
  }

  .car-card {
    padding: 20px 18px;
    font-size: 24px;
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }
}
</style>
