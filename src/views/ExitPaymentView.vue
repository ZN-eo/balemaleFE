<template>
  <div class="exit-payment-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 -->
    <div class="bottom-section">
      <!-- 차량 정보 표 (백엔드 ParkedCar 응답 구조) -->
      <div class="info-panel">
        <div v-if="loading" class="info-loading">조회 중...</div>
        <div v-else-if="loadError" class="info-error">{{ loadError }}</div>
        <template v-else>
          <div class="info-row">
            <div class="info-label">차량번호</div>
            <div class="info-value">{{ parkedCar?.plate ?? '' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">입차시각</div>
            <div class="info-value">{{ formattedEntryAt }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">주차시간</div>
            <div class="info-value">{{ parkedCar?.parkedTime ?? '' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">주차금액</div>
            <div class="info-value">{{ formattedAmount }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">주차위치</div>
            <div class="info-value">{{ parkedCar?.nodeCode ?? '' }}</div>
          </div>
        </template>
      </div>

      <div class="action-bar">
        <button type="button" class="prev-btn" @click="goBack">이전</button>
        <button type="button" class="pay-btn" @click="pay">정산하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import { getParkedCars } from '@/api/modules/public'

export default {
  name: 'ExitPaymentView',
  components: {
    ParkingMap
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const parkedCar = ref(null)
    const loading = ref(true)
    const loadError = ref('')

    onMounted(async () => {
      // 1) 라우트 state로 전달된 ParkedCar가 있으면 사용 (직접 넘긴 경우)
      const stateCar = history.state?.parkedCar
      if (stateCar && stateCar.vehicleId != null) {
        parkedCar.value = stateCar
        loading.value = false
        return
      }
      // 2) exit/list에서 query.vehicleId로 들어온 경우 → API로 상세 조회
      const vehicleIdRaw = route.query.vehicleId
      const vehicleId = Array.isArray(vehicleIdRaw) ? vehicleIdRaw[0] : vehicleIdRaw
      if (!vehicleId) {
        loadError.value = '차량 정보를 찾을 수 없습니다.'
        loading.value = false
        return
      }
      try {
        const res = await getParkedCars(Number(vehicleId))
        const data = res?.data?.data
        if (Array.isArray(data) && data.length > 0) {
          parkedCar.value = data[0]
        } else if (data && !Array.isArray(data)) {
          parkedCar.value = data
        } else {
          loadError.value = '차량 상세 정보를 불러올 수 없습니다.'
        }
      } catch (e) {
        loadError.value = '차량 정보 조회에 실패했습니다.'
        if (import.meta.env.DEV) console.warn(e)
      } finally {
        loading.value = false
      }
    })

    // 입차시각: 분까지만 표시 (예: 2026-01-21 04:00)
    const formattedEntryAt = computed(() => {
      if (!parkedCar.value?.entryAt) return ''
      const dateStr = parkedCar.value.entryAt
      try {
        const date = new Date(dateStr)
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        return `${y}-${m}-${d} ${h}:${min}`
      } catch {
        return dateStr.slice(0, 16).replace('T', ' ')
      }
    })

    // 주차금액: 천 단위 콤마 + 원 (예: 408,000원)
    const formattedAmount = computed(() => {
      if (parkedCar.value?.amount == null) return ''
      return `${Number(parkedCar.value.amount).toLocaleString()}원`
    })

    const goBack = () => {
      router.back()
    }

    const pay = () => {
      // TODO: 결제/정산 로직 연결
      router.push('/exit/complete')
    }

    return {
      parkedCar,
      loading,
      loadError,
      formattedEntryAt,
      formattedAmount,
      goBack,
      pay
    }
  }
}
</script>

<style scoped>
.exit-payment-container {
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
  min-height: 0;
  align-items: flex-start;
  justify-content: space-between;
}

.info-panel {
  width: 100%;
  border: 1px solid #000;
  box-sizing: border-box;
  overflow: hidden;
  margin-top: 40px;
}

.info-loading,
.info-error {
  padding: 24px 16px;
  text-align: center;
  font-size: 21px;
  background: #d9d9d9;
  color: #000;
}

.info-error {
  color: #d32f2f;
}

.info-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  border-top: 1px solid #000;
  height: 80px;
}

.info-row:first-child {
  border-top: none;
}

.info-label {
  background: #8a8a8a;
  color: #fff;
  font-weight: 700;
  font-size: 21px; /* 기본(16px) 대비 약 +30% */
  padding: 0 16px;
  border-right: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-value {
  background: #d9d9d9;
  font-size: 21px; /* 기본(16px) 대비 약 +30% */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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

.pay-btn {
  background-color: #2f5fb3;
  color: #fff;
  border: 1px solid #1e3f79;
  padding: 12px 28px;
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

  .info-row {
    grid-template-columns: 120px 1fr;
  }

  .info-label {
    padding: 14px 10px;
    font-size: 18px; /* 14px 대비 약 +30% */
  }

  .info-value {
    font-size: 18px; /* 14px 대비 약 +30% */
  }

  .prev-btn,
  .pay-btn {
    padding: 10px 18px;
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

  .info-row {
    grid-template-columns: 140px 1fr;
  }

  .info-label {
    padding: 0 12px;
    font-size: 20px; /* 16px 대비 약 +30% */
  }

  .info-value {
    font-size: 20px; /* 16px 대비 약 +30% */
  }

  .prev-btn,
  .pay-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .exit-payment-container {
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

  .info-row {
    grid-template-columns: 180px 1fr;
  }

  .info-label {
    padding: 0 18px;
    font-size: 23px; /* 18px 대비 약 +30% */
  }

  .info-value {
    font-size: 23px; /* 18px 대비 약 +30% */
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }

  .pay-btn {
    padding: 14px 32px;
    font-size: 18px;
  }
}
</style>
