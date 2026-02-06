<template>
  <div class="select-container">
    <!-- 중간 섹션 -->
    <div class="middle-section">
      <ParkingMap />
    </div>

    <!-- 하단 섹션 - 버튼 영역 -->
    <div class="bottom-section" ref="bottomSectionRef">
      <div class="bottom-section__fit">
        <div class="action-panel">
          <div class="button-container">
            <button @click="goToExitList" class="action-btn exit-btn">
              조회 / 출차
            </button>
            <button @click="goToEntryList" class="action-btn entry-btn">
              입차
            </button>
          </div>
        </div>
        <button @click="goToHome" class="prev-btn">이전</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ParkingMap from '@/components/ParkingMap.vue'
import { useBottomSectionScale } from '@/composables/useBottomSectionScale'

export default {
  name: 'SelectView',
  components: {
    ParkingMap
  },
  setup() {
    const bottomSectionRef = ref(null)
    useBottomSectionScale(bottomSectionRef)
    const route = useRoute()
    const router = useRouter()

    const goToExitList = () => {
      router.push({
        path: '/exit/list',
        query: { vehicleFourNumber: route.query.vehicleFourNumber }
      })
    }

    const goToEntryList = () => {
      router.push({
        path: '/entry/list',
        query: { vehicleFourNumber: route.query.vehicleFourNumber }
      })
    }

    const goToHome = () => {
      router.push('/')
    }

    return {
      bottomSectionRef,
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

.status-banner {
  border: 1px solid #000;
  padding: 16px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.bottom-section {
  flex: 0 0 auto;
  width: 800px;
  max-width: 100%;
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

.action-panel {
  width: 100%;
  flex: 1;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 7vw, 60px) clamp(16px, 4vw, 32px);
  box-sizing: border-box;
  border-radius: var(--radius-card);
}

.button-container {
  display: flex;
  gap: clamp(28px, 8vw, 80px);
  justify-content: center;
  width: 100%;
  max-width: 520px;
}

.action-btn {
  width: clamp(140px, 26vw, 190px);
  aspect-ratio: 1;
  border: none;
  background: var(--gradient-primary);
  color: #fff;
  font-size: clamp(20px, 5vw, 30px);
  font-weight: bold;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: pre-line;
  border-radius: var(--radius-card);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  transition: box-shadow 0.2s;
}
.action-btn:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
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

  .status-banner {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .bottom-section {
    padding: 0.5rem 0.75rem 0.75rem 0.75rem;
    gap: 0.75rem;
  }

  .action-panel {
    padding: 22px 14px;
    border-radius: 8px;
  }

  /* clamp로 자동 스케일되지만, 모바일에서 버튼이 너무 커지는 것 방지 */
  .action-btn {
    max-width: 150px;
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

  .status-banner {
    padding: 0.875rem;
  }

  .bottom-section {
    padding: 0.5rem 1rem 1rem 1rem;
    gap: 0.875rem;
  }

  /* clamp로 자동 스케일 */
  .action-panel {
    padding: 34px 18px;
  }

  .prev-btn {
    padding: 11px 22px;
    font-size: 15px;
  }
}

/* 데스크톱 (769px 이상) — HomeView section 크기 통일 */
@media (min-width: 769px) {
  .select-container {
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

  .status-banner {
    padding: 1.125rem;
    font-size: 1rem;
  }

  .bottom-section {
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
    gap: 1.125rem;
  }

  /* clamp로 자동 스케일 */
  .action-panel {
    padding: 56px 24px;
  }

  .prev-btn {
    padding: 14px 28px;
    font-size: 18px;
  }
}
</style>