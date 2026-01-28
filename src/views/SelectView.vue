<template>
  <div class="select-container">
    <!-- 상단 섹션 -->
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>

    <!-- 중간 섹션 -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 - 버튼 영역 -->
    <div class="bottom-section">
      <div class="button-container">
        <button @click="goToExitList" class="action-btn exit-btn">
          조회 / 출차
        </button>
        <button @click="goToEntryList" class="action-btn entry-btn">
          입차
        </button>
      </div>
      <button @click="goToHome" class="prev-btn">이전</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'SelectView',
  components: {
    ParkingMap
  },
  setup() {
    const router = useRouter()

    const goToExitList = () => {
      router.push('/exit/list')
    }

    const goToEntryList = () => {
      router.push('/entry/list')
    }

    const goToHome = () => {
      router.push('/')
    }

    return {
      goToExitList,
      goToEntryList,
      goToHome
    }
  }
}
</script>

<style scoped>
.select-container {
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

.status-banner {
  border: 1px solid #000;
  padding: 16px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
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

.button-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.action-btn {
  flex: 1;
  max-width: 200px;
  aspect-ratio: 1;
  border: 1px solid #000;
  background-color: #fff;
  color: #000;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: pre-line;
  border-radius: 8px;
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

  .status-banner {
    padding: 12px;
    font-size: 14px;
  }

  .bottom-section {
    padding: 12px;
    gap: 12px;
  }

  .button-container {
    gap: 12px;
  }

  .action-btn {
    max-width: 150px;
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

  .status-banner {
    padding: 14px;
  }

  .bottom-section {
    padding: 16px;
    gap: 14px;
  }

  .button-container {
    gap: 16px;
  }

  .action-btn {
    max-width: 180px;
    font-size: 20px;
  }

  .prev-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .select-container {
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

  .status-banner {
    padding: 18px;
    font-size: 16px;
  }

  .bottom-section {
    padding: 24px;
    gap: 18px;
  }

  .button-container {
    gap: 24px;
  }

  .action-btn {
    max-width: 250px;
    font-size: 28px;
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }
}
</style>