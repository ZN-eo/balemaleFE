<template>
  <div class="exit-complete-container">
    <div class="middle-section">
      <ParkingMap :initial-map-data="parkingMapData" />
    </div>
    <div class="bottom-section"></div>
  </div>
</template>

<script>
import ParkingMap from '@/components/ParkingMap.vue'

export default {
  name: 'ExitCompleteView',
  components: {
    ParkingMap
  },
  setup() {
    const parkingMapData = history.state?.parkingMapData ?? null
    return { parkingMapData }
  }
}
</script>

<style scoped>
.exit-complete-container {
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
  width: 712px;
  max-width: 100%;
  height: 500px;
  min-height: 500px;
  margin: 0 auto;
  padding: 0.5rem 0.625rem 0.625rem 0.625rem;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: flex-end;
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
  .exit-complete-container {
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
