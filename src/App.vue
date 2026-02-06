<script>
import { defineComponent } from 'vue'
import { connect, disconnect } from './api/websocket/stompClient'
import RobotStatus from '@/components/RobotStatus.vue'
import { useParkingMapStore } from '@/stores/parkingMapStore'

export default defineComponent({
  name: 'App',
  components: { RobotStatus },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    }
  },
  watch: {
      $route: 'updateAppBackground'
    },
  mounted() {
      this.initSocket()
      this.updateAppBackground()
      if (!this.isAdminRoute) {
        useParkingMapStore().fetchParkingMap()
      }
    },
  beforeUnmount() {
    disconnect()
  },
  methods: {
    async initSocket() {
      try {
        await connect()
        console.log('STOMP 연결 성공')
      } catch (error) {
        console.error('STOMP 연결 실패:', error)
      }
    },
    goToAdmin() {
      this.$router.push('/admin/login')
    },
    updateAppBackground() {
      const app = this.$el?.parentElement
      if (!app) return
      if (this.isAdminRoute) {
        app.classList.remove('app-with-gradient')
      } else {
        app.classList.add('app-with-gradient')
      }
    }
  }
})
</script>

<template>
  <div class="app-wrap">
    <button v-if="!isAdminRoute" @click="goToAdmin" class="admin-btn"></button>
    <template v-if="isAdminRoute">
      <router-view />
    </template>
    <template v-else>
      <div class="app-layout">
        <div class="top-section">
          <div class="top-section-inner">
            <RobotStatus />
          </div>
        </div>
        <main class="app-main">
          <router-view />
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-wrap {
  position: relative;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
}

.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.top-section {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.625rem 0 0;
  width: 100%;
  box-sizing: border-box;
}

/* parking-map과 동일한 너비(뷰 middle-section 기준) */
.top-section-inner {
  width: 100%;
  max-width: 100%;
  padding: 0 0.625rem;
  box-sizing: border-box;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .top-section-inner {
    padding: 0 0.75rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .top-section-inner {
    padding: 0 1rem;
  }
}

@media (min-width: 769px) {
  .top-section-inner {
    max-width: 75rem;
    padding: 0 1.5rem;
  }
}

.app-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* 관리자 버튼 - fixed는 네비게이션용으로만 사용 */
.admin-btn {
  position: fixed;
  top: 1.25rem;
  left: max(4.375rem, calc(50% - 37.5rem + 4.375rem));
  width: 3.75rem;
  min-height: var(--touch-min-height, 3rem);
  height: 0.875rem;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 9999;
}

@media (max-width: 480px) {
  .admin-btn {
    top: 0.75rem;
    left: max(0.75rem, calc(50% - 37.5rem + 0.75rem));
    width: 3.75rem;
    height: 0.75rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .admin-btn {
    top: 1rem;
    left: max(1rem, calc(50% - 37.5rem + 1rem));
    width: 3.75rem;
    height: 0.8125rem;
  }
}

@media (min-width: 769px) {
  .admin-btn {
    top: 1.5rem;
    left: max(1.5rem, calc(50% - 37.5rem + 1.5rem));
    width: 3.75rem;
    height: 0.875rem;
  }
}
</style>
