<template>
  <div class="entry-complete-container">
    <div class="top-section">
      <div class="robot-status">주차로봇 대기중</div>
    </div>
    <div class="middle-section">
      <ParkingMap />
    </div>
  </div>
</template>

<script>
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'EntryCompleteView',
  components: {
    ParkingMap
  },
  setup() {
    return {}
  }
}
</script>

<style scoped>
.entry-complete-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: #1B4300;
}

.top-section {
  padding: 10px;
  padding-top: 60px;
  padding-left: 70px;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.robot-status {
  border: 1px solid #000;
  background: #fff;
  padding: 10px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  color: #000;
  font-size: 14px;
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
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .entry-complete-container {
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
}
</style>
