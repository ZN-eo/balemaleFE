<template>
  <div class="parking-map">
    <div class="map-label">주차장 맵 (고정)</div>
    <div class="parking-info">
      <div v-if="parkingCount.totalCount === 0" class="info-badge full">만차</div>
      <div v-else class="info-badge spaces">
        일반 자리 : {{ parkingCount.normalCount }} / 장애인 자리 : {{ parkingCount.disabledCount }}
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
    const parkingCount = ref({
      normalCount: 0,
      disabledCount: 0,
      totalCount: 0
    })

    // 주차장 잔여수 조회
    const fetchParkingCount = async () => {
      try {
        const response = await getAvailableParkingCount()
        if (response.data && response.data.data) {
          parkingCount.value = response.data.data
        }
      } catch (error) {
        console.error('주차장 잔여수 조회 실패:', error)
      }
    }

    onMounted(() => {
      fetchParkingCount()
    })

    return {
      parkingCount
    }
  }
}
</script>

<style scoped>
.parking-map {
  border: 1px solid #000;
  min-height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.map-label {
  text-align: center;
}

.parking-info {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 600px;
}

.info-badge {
  border: 1px solid #000;
  padding: 12px 16px;
  text-align: center;
  background-color: #fff;
  font-weight: bold;
  box-sizing: border-box;
}

.info-badge.full {
  color: #ff0000;
}

.info-badge.spaces {
  color: #000;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .parking-map {
    min-height: 200px;
  }

  .map-label {
    font-size: 14px;
  }

  .parking-info {
    bottom: 12px;
    width: calc(100% - 24px);
  }

  .info-badge {
    padding: 10px 12px;
    font-size: 12px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .parking-map {
    min-height: 250px;
  }

  .map-label {
    font-size: 16px;
  }

  .parking-info {
    bottom: 14px;
    width: calc(100% - 28px);
  }

  .info-badge {
    padding: 11px 14px;
    font-size: 14px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .parking-map {
    min-height: 400px;
  }

  .map-label {
    font-size: 18px;
  }

  .parking-info {
    bottom: 18px;
    width: calc(100% - 36px);
  }

  .info-badge {
    padding: 14px 18px;
    font-size: 16px;
  }
}
</style>
