<template>
  <div class="parking-map">
    <div class="parking-grids-container">
    </div>
    <div class="parking-info">
      <div v-if="parkingCount.totalCount === 0" class="info-text">
        <span>일반 자리 : <span class="full-text">만차</span> / 장애인 자리 : <span class="full-text">만차</span></span>
      </div>
      <div v-else class="info-text">
        <span>일반 자리 : {{ parkingCount.normalCount }} / 장애인 자리 : {{ parkingCount.disabledCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAvailableParkingCount } from '@/api/modules/public'

export default {
  name: 'ParkingMap',
  setup() {
    // 상단 그리드: 2행 4열 (8개)
    const topGridSpots = ref(
      Array.from({ length: 8 }, () => ({ occupied: false }))
    )
    
    // 하단 그리드: 1행 4열 (4개)
    const bottomGridSpots = ref(
      Array.from({ length: 4 }, () => ({ occupied: false }))
    )

    const parkingCount = ref({
      normalCount: 0,
      disabledCount: 0,
      totalCount: 0
    })

    // 주차장 잔여수 조회 (실패 시 기본값 0 유지, 백엔드 미연결 시 ERR_CONNECTION_REFUSED)
    const fetchParkingCount = async () => {
      try {
        const response = await getAvailableParkingCount()
        if (response.data && response.data.data) {
          parkingCount.value = response.data.data
        }
      } catch (error) {
        // 백엔드 서버가 꺼져 있거나 baseURL 잘못되면 ERR_CONNECTION_REFUSED 발생
        if (import.meta.env.DEV) {
          console.warn('주차장 잔여수 조회 실패 (백엔드 미연결 시 정상). VITE_API_BASE_URL 확인 후 서버 실행 여부 확인:', error?.message || error)
        }
      }
    }

    onMounted(() => {
      fetchParkingCount()
    })

    return {
      topGridSpots,
      bottomGridSpots,
      parkingCount
    }
  }
}
</script>

<style scoped>
.parking-map {
  border: 1px solid #000;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px;
  gap: 8px;
  height: 280px;
  flex-shrink: 0;
}

.robot-status-text {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.parking-grids-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-shrink: 0;
}

.parking-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  width: 100%;
  box-sizing: border-box;
}

.parking-grid.top-grid {
  grid-template-rows: repeat(2, 1fr);
}

.parking-grid.bottom-grid {
  grid-template-rows: repeat(1, 1fr);
}

.parking-spot {
  aspect-ratio: 1 / 2;
  border-top: 6px solid #FFD700;
  border-left: 6px solid #FFD700;
  border-right: 6px solid #FFD700;
  border-bottom: 6px solid #FFD700;
  background: #fff;
  box-sizing: border-box;
}

.parking-grid.top-grid .parking-spot:nth-child(n+5) {
  border-top: none;
}

.parking-grid .parking-spot:nth-child(4n+2),
.parking-grid .parking-spot:nth-child(4n+3),
.parking-grid .parking-spot:nth-child(4n+4) {
  border-left: none;
}

.parking-spot.occupied {
  background: #f0f0f0;
}

.parking-info {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  flex-shrink: 0;
}

.info-text {
  background: #fff;
  padding: 6px 10px;
  text-align: center;
  font-size: 12px;
  color: #000;
  border: 1px solid #000;
  box-sizing: border-box;
}

.full-text {
  color: #ff0000;
  font-weight: bold;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .parking-map {
    padding: 6px;
    gap: 6px;
    height: 200px;
  }

  .robot-status-text {
    font-size: 12px;
    margin-bottom: 3px;
  }

  .parking-grids-container {
    max-width: 100%;
    gap: 2px;
  }

  .parking-grid {
    gap: 0;
  }

  .parking-spot {
    aspect-ratio: 1 / 2;
    border-top: 3px solid #FFD700;
    border-left: 3px solid #FFD700;
    border-right: 3px solid #FFD700;
    border-bottom: 3px solid #FFD700;
  }

  .info-text {
    padding: 5px 8px;
    font-size: 10px;
  }

  .parking-grid.top-grid .parking-spot:nth-child(n+5) {
    border-top: none;
  }

  .parking-grid .parking-spot:nth-child(4n+2),
  .parking-grid .parking-spot:nth-child(4n+3),
  .parking-grid .parking-spot:nth-child(4n+4) {
    border-left: none;
  }

  .info-text {
    padding: 10px 12px;
    font-size: 12px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .parking-map {
    height: 300px;
    padding: 16px;
    gap: 16px;
  }

  .robot-status-text {
    font-size: 16px;
  }

  .parking-grids-container {
    max-width: 450px;
  }

  .parking-grid {
    gap: 0;
  }

  .parking-spot {
    aspect-ratio: 1 / 2;
    border-top: 5px solid #FFD700;
    border-left: 5px solid #FFD700;
    border-right: 5px solid #FFD700;
    border-bottom: 5px solid #FFD700;
  }

  .parking-grid.top-grid .parking-spot:nth-child(n+5) {
    border-top: none;
  }

  .parking-grid .parking-spot:nth-child(4n+2),
  .parking-grid .parking-spot:nth-child(4n+3),
  .parking-grid .parking-spot:nth-child(4n+4) {
    border-left: none;
  }

  .info-text {
    padding: 11px 14px;
    font-size: 13px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .parking-map {
    height: 400px;
    padding: 24px;
    gap: 24px;
  }

  .robot-status-text {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .parking-grids-container {
    max-width: 600px;
  }

  .parking-grid {
    gap: 0;
  }

  .parking-spot {
    aspect-ratio: 1 / 2;
    border-top: 8px solid #FFD700;
    border-left: 8px solid #FFD700;
    border-right: 8px solid #FFD700;
    border-bottom: 8px solid #FFD700;
  }

  .parking-grid.top-grid .parking-spot:nth-child(n+5) {
    border-top: none;
  }

  .parking-grid .parking-spot:nth-child(4n+2),
  .parking-grid .parking-spot:nth-child(4n+3),
  .parking-grid .parking-spot:nth-child(4n+4) {
    border-left: none;
  }

  .info-text {
    padding: 14px 18px;
    font-size: 16px;
  }
}
</style>
