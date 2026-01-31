<template>
  <div class="parking-map">
    <div class="parking-grids-container">
      <!-- 상단 구역 (일반) : 2행 4열 -->
      <div class="zone">
        <div class="parking-grid top-grid">
          <div
            v-for="(spot, idx) in topGridSpots"
            :key="spot.slotId ?? `top-${idx}`"
            class="parking-spot"
            :class="{ occupied: spot.occupied }"
          ></div>
        </div>
      </div>

      <!-- 하단 구역 (장애인) : 1행 4열, 우측 2칸 장애인 표시 -->
      <div class="zone">
        <div class="parking-grid bottom-grid">
          <div
            v-for="(spot, idx) in bottomGridSpots"
            :key="spot.slotId ?? `bottom-${idx}`"
            class="parking-spot"
            :class="{ occupied: spot.occupied }"
          >
            <span v-if="spot.isDisabled" class="disabled-icon" aria-hidden="true">♿</span>
          </div>
        </div>
      </div>
    </div>

    <div class="parking-info">
      <div class="info-text">
        <span class="label">일반 자리 :</span>
        <span class="value" :class="{ full: parkingCount.normalCount === 0 }">
          {{ parkingCount.normalCount === 0 ? '만차' : parkingCount.normalCount }}
        </span>
        <span class="divider">/</span>
        <span class="label">장애인 자리 :</span>
        <span class="value" :class="{ full: parkingCount.disabledCount === 0 }">
          {{ parkingCount.disabledCount === 0 ? '만차' : parkingCount.disabledCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAvailableParkingCount, getParkingMap } from '@/api/modules/public'

// API 슬롯 → 그리드용 스팟 (occupied, isDisabled, slotId)
function toSpot(slot) {
  return {
    slotId: slot.slotId,
    occupied: slot.slotStatus === 'OCCUPIED',
    isDisabled: slot.slotType === 'DISABLED'
  }
}

function applyMapList(list, topGridSpots, bottomGridSpots) {
  if (!Array.isArray(list) || list.length < 12) {
    topGridSpots.value = Array.from({ length: 8 }, () => ({ occupied: false, isDisabled: false }))
    bottomGridSpots.value = Array.from({ length: 4 }, (_, i) => ({ occupied: false, isDisabled: i < 2 }))
    return
  }
  bottomGridSpots.value = list.slice(0, 4).map(toSpot)
  const bRow = list.slice(4, 8).map(toSpot)
  const cRow = list.slice(8, 12).map(toSpot)
  topGridSpots.value = [...cRow, ...bRow]
}

export default {
  name: 'ParkingMap',
  props: {
    /** 입차/정산 완료 후 넘긴 최신 맵 데이터 있으면 사용, 없으면 mount 시 API 호출 */
    initialMapData: {
      type: Array,
      default: null
    }
  },
  setup(props) {
    // 상단 그리드: 2행 4열 = C1~C4(1행), B1~B4(2행)
    const topGridSpots = ref([])
    // 하단 그리드: 1행 4열 = A1~A4
    const bottomGridSpots = ref([])

    const parkingCount = ref({
      normalCount: 0,
      disabledCount: 0,
      totalCount: 0
    })

    const fetchParkingMap = async () => {
      try {
        const res = await getParkingMap()
        const list = res.data?.data ?? res.data ?? []
        applyMapList(list, topGridSpots, bottomGridSpots)
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('주차장 맵 조회 실패:', error?.message || error)
        }
        topGridSpots.value = Array.from({ length: 8 }, () => ({ occupied: false, isDisabled: false }))
        bottomGridSpots.value = Array.from({ length: 4 }, (_, idx) => ({ occupied: false, isDisabled: idx < 2 }))
      }
    }

    const fetchParkingCount = async () => {
      try {
        const response = await getAvailableParkingCount()
        if (response.data && response.data.data) {
          parkingCount.value = response.data.data
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('주차장 잔여수 조회 실패:', error?.message || error)
        }
      }
    }

    onMounted(() => {
      const list = props.initialMapData
      if (Array.isArray(list) && list.length >= 12) {
        applyMapList(list, topGridSpots, bottomGridSpots)
      } else {
        fetchParkingMap()
      }
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
  /* responsive scale tokens */
  --map-padding: clamp(12px, 2.6vw, 16px);
  --section-gap: clamp(12px, 3vw, 18px);
  --border: clamp(5px, 1.6vw, 8px);
  --zone-padding: clamp(8px, 2.2vw, 10px);
  --badge-font: clamp(12px, 2.6vw, 16px);
  --icon-size: clamp(22px, 4.2vw, 26px);
  --icon-font: clamp(16px, 3.2vw, 18px);

  border: 1px solid #000;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: var(--map-padding);
  gap: var(--section-gap);
}

.parking-grids-container {
  width: 100%;
  max-width: clamp(280px, 92vw, 620px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
  align-items: center;
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

.zone {
  width: 100%;
  padding: var(--zone-padding);
  box-sizing: border-box;
  background: #fff;
}

/* 칸마다 한쪽만 border → 붙어 보이게 (겹침 방지) */
.parking-spot {
  aspect-ratio: 1 / 1;
  border-right: var(--border) solid #8b8b8b;
  border-bottom: var(--border) solid #8b8b8b;
  border-left: none;
  border-top: none;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parking-spot:nth-child(4n + 1) {
  border-left: var(--border) solid #8b8b8b;
}

.parking-spot:nth-child(-n + 4) {
  border-top: var(--border) solid #8b8b8b;
}

.parking-spot.occupied {
  background: #f0f0f0;
}

.disabled-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: 6px;
  background: #2f5fb3;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--icon-font);
  line-height: 1;
}

.parking-info {
  width: 100%;
  max-width: clamp(280px, 92vw, 620px);
  margin: 0 auto;
}

.info-text {
  background: #fff;
  padding: clamp(10px, 2.2vw, 12px) clamp(12px, 2.6vw, 14px);
  text-align: center;
  font-size: var(--badge-font);
  color: #000;
  border: 1px solid #000;
  box-sizing: border-box;
  font-weight: 700;
}

.label {
  color: #000;
}

.divider {
  margin: 0 8px;
}

.value {
  margin: 0 6px;
  color: #000;
}

.value.full {
  color: #ff0000;
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .parking-map {
    padding: 12px;
    gap: 12px;
  }

  .parking-grids-container {
    max-width: 100%;
    gap: 14px;
  }

  .parking-grid {
    gap: 0;
  }

  .zone {
    padding: 8px;
  }

  .parking-spot {
    border-width: 6px;
  }

  .disabled-icon {
    width: 22px;
    height: 22px;
    font-size: 16px;
  }

  .info-text {
    padding: 10px 12px;
    font-size: 12px;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .parking-grids-container {
    max-width: 560px;
  }

  .parking-grid {
    gap: 0;
  }

  .info-text {
    font-size: 13px;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .parking-grids-container {
    max-width: 620px;
  }

  .info-text {
    font-size: 16px;
  }
}
</style>
