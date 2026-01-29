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
      <!-- 차량 정보 표 (우측 값은 일단 빈칸) -->
      <div class="info-panel">
        <div class="info-row">
          <div class="info-label">차량번호</div>
          <div class="info-value"></div>
        </div>
        <div class="info-row">
          <div class="info-label">입차시각</div>
          <div class="info-value"></div>
        </div>
        <div class="info-row">
          <div class="info-label">주차시간</div>
          <div class="info-value"></div>
        </div>
        <div class="info-row">
          <div class="info-label">주차금액</div>
          <div class="info-value"></div>
        </div>
        <div class="info-row">
          <div class="info-label">주차위치</div>
          <div class="info-value"></div>
        </div>
      </div>

      <div class="action-bar">
        <button type="button" class="prev-btn" @click="goBack">이전</button>
        <button type="button" class="pay-btn" @click="pay">정산하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'ExitPaymentView',
  components: {
    ParkingMap
  },
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.back()
    }

    const pay = () => {
      // TODO: 결제/정산 로직 연결
      router.push('/exit/complete')
    }

    return {
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
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.middle-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.bottom-section {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-panel {
  width: 100%;
  border: 1px solid #000;
  box-sizing: border-box;
  overflow: hidden;
}

.info-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  border-top: 1px solid #000;
}

.info-row:first-child {
  border-top: none;
}

.info-label {
  background: #8a8a8a;
  color: #fff;
  font-weight: 700;
  padding: 18px 16px;
  border-right: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-value {
  background: #d9d9d9;
  min-height: 56px;
  box-sizing: border-box;
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
  border-radius: 8px;
  box-sizing: border-box;
}

.pay-btn {
  background-color: #2f5fb3;
  color: #fff;
  border: 1px solid #1e3f79;
  padding: 12px 28px;
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

  .info-row {
    grid-template-columns: 120px 1fr;
  }

  .info-label {
    padding: 14px 10px;
    font-size: 14px;
  }

  .info-value {
    min-height: 48px;
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

  .info-row {
    grid-template-columns: 140px 1fr;
  }

  .info-label {
    padding: 16px 12px;
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

  .info-row {
    grid-template-columns: 180px 1fr;
  }

  .info-label {
    padding: 20px 18px;
    font-size: 18px;
  }

  .info-value {
    min-height: 64px;
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
