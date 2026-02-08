<template>
  <div class="parking-map" :class="{ 'parking-map--teal': highlightVariant === 'teal' }">
    <div class="parking-grids-container">
      <!-- 상단 구역 (일반) : 2행 4열 C1~C4, B1~B4 -->
      <div class="zone zone-top">
        <div class="parking-grid top-grid">
          <div
            v-for="(spot, idx) in topGridSpots"
            :key="spot.slotId ?? `top-${idx}`"
            class="parking-spot-wrap"
          >
            <div
              class="parking-spot"
              :class="{
                occupied: spot.occupied,
                selected: isSlotHighlighted('top', idx),
                blocked: spot.blocked
              }"
            >
              <span v-if="isSlotHighlighted('top', idx)" class="selected-blob" aria-hidden="true" />
              <div class="spot-center">
                <img
                  v-if="spot.occupied && !spot.blocked"
                  :src="getCarIconSrc('top', idx)"
                  class="car-icon-img"
                  alt="주차된 차량"
                />
                <span v-else class="available-text">{{
                  isSlotHighlighted('top', idx) ? 'Selected' : spot.blocked ? '주차 불가' : '주차 가능'
                }}</span>
              </div>
              <span
                class="slot-code"
                :class="{
                  occupied: spot.occupied,
                  selected: isSlotHighlighted('top', idx),
                  blocked: spot.blocked
                }"
              >
                {{ TOP_SLOT_CODES[idx] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 구역 (장애인) : 1행 4열 A1~A4 -->
      <div class="zone zone-bottom">
        <div class="parking-grid bottom-grid">
          <div
            v-for="(spot, idx) in bottomGridSpots"
            :key="spot.slotId ?? `bottom-${idx}`"
            class="parking-spot-wrap"
          >
            <div
              class="parking-spot"
              :class="{
                occupied: spot.occupied,
                selected: isSlotHighlighted('bottom', idx),
                disabled: spot.isDisabled,
                blocked: spot.blocked
              }"
            >
              <span
                v-if="isSlotHighlighted('bottom', idx)"
                class="selected-blob"
                aria-hidden="true"
              />
              <div class="spot-center">
                <svg
                  v-if="spot.isDisabled && !spot.blocked"
                  class="disabled-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  role="img"
                  aria-label="장애인"
                >
                  <path
                    d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM680-80v-200H480q-33 0-56.5-23.5T400-360v-240q0-33 23.5-56.5T480-680q24 0 41.5 10.5T559-636q55 66 99.5 90.5T760-520v80q-53 0-107-23t-93-55v138h120q33 0 56.5 23.5T760-300v220h-80Zm-280 0q-83 0-141.5-58.5T200-280q0-72 45.5-127T360-476v82q-35 14-57.5 44.5T280-280q0 50 35 85t85 35q39 0 69.5-22.5T514-240h82q-14 69-69 114.5T400-80Z"
                    fill="currentColor"
                  />
                </svg>
                <img
                  v-if="spot.occupied && !spot.blocked"
                  :src="getCarIconSrc('bottom', idx)"
                  class="car-icon-img"
                  alt="주차된 차량"
                />
                <span v-else class="available-text">{{
                  isSlotHighlighted('bottom', idx) ? 'Selected' : spot.blocked ? '주차 불가' : '주차 가능'
                }}</span>
              </div>
              <span
                class="slot-code"
                :class="{
                  occupied: spot.occupied,
                  selected: isSlotHighlighted('bottom', idx),
                  disabled: spot.isDisabled,
                  blocked: spot.blocked
                }"
              >
                {{ BOTTOM_SLOT_CODES[idx] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="parking-info">
      <div class="info-text">
        <span class="label">일반 자리 :</span>
        <span class="value" :class="{ full: parkingCountLoaded && parkingCount.normalCount === 0 }">
          {{ !parkingCountLoaded ? '—' : (parkingCount.normalCount === 0 ? '만차' : parkingCount.normalCount) }}
        </span>
        <span class="divider">/</span>
        <span class="label">장애인 자리 :</span>
        <span class="value value--disabled" :class="{ full: parkingCountLoaded && parkingCount.disabledCount === 0 }">
          {{ !parkingCountLoaded ? '—' : (parkingCount.disabledCount === 0 ? '만차' : parkingCount.disabledCount) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { getAvailableParkingCount } from '@/api/modules/public'
import { useParkingMapStore } from '@/stores/parkingMapStore'
import { defineComponent } from 'vue'
import blackCar from '@/assets/icons/black-car.png'
import blueCar from '@/assets/icons/blue-car.png'
import orangeCar from '@/assets/icons/orange-car.png'
import redCar from '@/assets/icons/red-car.png'
// 위치 코드: 상단 2행4열 = C1~C4, B1~B4 / 하단 1행4열 = A1~A4
const TOP_SLOT_CODES = ['C1', 'C2', 'C3', 'C4', 'B1', 'B2', 'B3', 'B4']
const BOTTOM_SLOT_CODES = ['A1', 'A2', 'A3', 'A4']

const CAR_ICONS = [orangeCar, blackCar, redCar, blueCar]

// 칸별로 4개 차량 아이콘 중 하나를 랜덤(고정) 배정
function getCarIconSrc(zone, idx) {
  const seed = zone === 'top' ? idx : 8 + idx
  const i = (seed * 7 + 11) % CAR_ICONS.length
  return CAR_ICONS[i]
}

// API 슬롯 → 그리드용 스팟 (occupied, isDisabled, blocked, slotId)
function toSpot(slot) {
  return {
    slotId: slot.slotId,
    occupied: slot.slotStatus === 'OCCUPIED',
    isDisabled: slot.slotType === 'DISABLED',
    blocked: slot.nodeStatus === 'BLOCKED'
  }
}

function applyMapList(list, topGridSpots, bottomGridSpots) {
  if (!Array.isArray(list) || list.length < 12) {
    topGridSpots.value = Array.from({ length: 8 }, () => ({ occupied: false, isDisabled: false, blocked: false }))
    bottomGridSpots.value = Array.from({ length: 4 }, (_, i) => ({
      occupied: false,
      isDisabled: i < 2,
      blocked: false
    }))
    return
  }
  bottomGridSpots.value = list.slice(0, 4).map(toSpot)
  const bRow = list.slice(4, 8).map(toSpot)
  const cRow = list.slice(8, 12).map(toSpot)
  topGridSpots.value = [...cRow, ...bRow]
}

export default defineComponent({
  name: 'ParkingMap',
  props: {
    /** 입차/정산 완료 후 넘긴 최신 맵 데이터 있으면 사용, 없으면 mount 시 API 호출 */
    initialMapData: {
      type: Array,
      default: null
    },
    /** 강조할 주차칸 코드 (예: A1, B2) - EntryCompleteView·ExitPaymentView에서 전달 */
    highlightedSlotCode: {
      type: String,
      default: null
    },
    /** exit/payment 시 teal 색상 테마 (장애인칸 linear-gradient #0d9488, slot-code #16d2c1) */
    highlightVariant: {
      type: String,
      default: 'default'
    }
  },
  setup(props) {
    const isSlotHighlighted = (zone, idx) => {
      if (!props.highlightedSlotCode) return false
      const code = String(props.highlightedSlotCode).trim().toUpperCase().replace(/-/g, '')
      const slotCode = zone === 'top' ? TOP_SLOT_CODES[idx] : BOTTOM_SLOT_CODES[idx]
      return slotCode === code
    }

    // 상단 그리드: 2행 4열 = C1~C4(1행), B1~B4(2행)
    const topGridSpots = ref([])
    // 하단 그리드: 1행 4열 = A1~A4
    const bottomGridSpots = ref([])

    const parkingCount = ref({
      normalCount: 0,
      disabledCount: 0,
      totalCount: 0
    })
    /** 잔여 수 API 조회 완료 여부 (로딩 중에는 만차로 보이지 않도록) */
    const parkingCountLoaded = ref(false)

    const parkingMapStore = useParkingMapStore()

    /** initialMapData가 있으면 우선 적용 (입차/정산 완료 후 부모가 넘긴 최신 맵) */
    watch(
      () => props.initialMapData,
      (list) => {
        if (Array.isArray(list) && list.length >= 12) {
          applyMapList(list, topGridSpots, bottomGridSpots)
        }
      },
      { immediate: true }
    )

    /** initialMapData 없을 때만 스토어 맵 데이터 적용 */
    watch(
      () => parkingMapStore.mapData,
      (list) => {
        if (props.initialMapData?.length >= 12) return
        if (Array.isArray(list) && list.length >= 12) {
          applyMapList(list, topGridSpots, bottomGridSpots)
        } else if (list === null) {
          topGridSpots.value = Array.from({ length: 8 }, () => ({ occupied: false, isDisabled: false, blocked: false }))
          bottomGridSpots.value = Array.from({ length: 4 }, (_, i) => ({
            occupied: false,
            isDisabled: i < 2,
            blocked: false
          }))
        }
      },
      { immediate: true }
    )

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
      } finally {
        parkingCountLoaded.value = true
      }
    }

    onMounted(() => {
      const list = props.initialMapData ?? parkingMapStore.mapData
      if (Array.isArray(list) && list.length >= 12) {
        applyMapList(list, topGridSpots, bottomGridSpots)
      } else if (!parkingMapStore.mapData) {
        parkingMapStore.fetchParkingMap()
      }
      fetchParkingCount()
    })

    return {
      TOP_SLOT_CODES,
      BOTTOM_SLOT_CODES,
      topGridSpots,
      bottomGridSpots,
      parkingCount,
      parkingCountLoaded,
      getCarIconSrc,
      isSlotHighlighted
    }
  }
})
</script>

<style scoped>
.parking-map {
  --map-padding: clamp(0.75rem, 1.5vh, 1rem);
  --section-gap: clamp(0.75rem, 1.8vh, 1.125rem);
  --zone-padding: clamp(0.5rem, 1.2vh, 0.625rem);
  --badge-font: clamp(0.75rem, 1.2vh, 1rem);
  --icon-size: clamp(1.375rem, 1.5vh, 1.625rem);
  --slot-w: 5.3125rem;
  --slot-h: 6.875rem;

  flex: 1 1 0;
  min-height: 0;
  font-family: var(--font-sans);
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
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
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  max-width: min(38.4375rem, 92%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: stretch;
  justify-content: stretch;
}

.zone {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  padding: var(--zone-padding);
  box-sizing: border-box;
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.zone-top {
  flex: 2 1 0;
}

.zone-bottom {
  flex: 1 1 0;
}

.parking-grid {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  box-sizing: border-box;
  align-items: stretch;
  justify-items: stretch;
}

.parking-grid.top-grid {
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.parking-grid.bottom-grid {
  grid-template-rows: minmax(0, 1fr);
}

.parking-spot-wrap {
  position: relative;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
}

/* 주차칸: 컨테이너 높이까지 비율 유지하며 채움 */
.parking-spot {
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  border: 1px dashed var(--border-light);
  border-radius: 0;
  background: var(--bg-card);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0.375rem 0.5rem 0.5rem;
  position: relative;
}

.parking-spot.occupied {
  background: var(--bg-page);
}

.parking-spot.blocked {
  background: repeating-linear-gradient(
    -45deg,
    var(--bg-page),
    var(--bg-page) 3px,
    rgba(220, 53, 69, 0.08) 3px,
    rgba(220, 53, 69, 0.08) 6px
  );
}

.parking-spot.selected {
  background: linear-gradient(180deg, #beaeff 0%, #ece8ff 50%, #faf5ff 100%);
  border-color: transparent;
  overflow: hidden;
  position: relative;
}

/* 배경에서 움직이는 블롭 (참고: blob-bounce) */
.selected-blob {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #b085f5;
  opacity: 0.75;
  filter: blur(0.875rem);
  animation: blob-bounce 5s infinite ease;
  pointer-events: none;
}

/* 회전하는 테두리: 한 줄 하이라이트만 */
.parking-spot.selected::before {
  content: '';
  position: absolute;
  inset: -40%;
  z-index: 1;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(176, 133, 245, 0) 40deg,
    rgba(176, 133, 245, 0.85) 70deg,
    rgba(176, 133, 245, 0) 110deg,
    transparent 360deg
  );
  animation: border-spin 1.8s linear infinite;
}

/* 안쪽 덮개: 반투명해서 블롭이 비치게 (참고: .bg) */
.parking-spot.selected::after {
  content: '';
  position: absolute;
  inset: 0.3125rem;
  border-radius: 0;
  background: linear-gradient(
    180deg,
    rgba(190, 174, 255, 0.65) 0%,
    rgba(236, 232, 255, 0.65) 50%,
    rgba(250, 245, 255, 0.7) 100%
  );
  backdrop-filter: blur(0.375rem);
  z-index: 1;
}

.parking-spot.selected .spot-center,
.parking-spot.selected .slot-code {
  position: relative;
  z-index: 2;
}

@keyframes border-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes blob-bounce {
  0% {
    transform: translate(-50%, -50%) translate3d(0, 0, 0);
  }
  25% {
    transform: translate(-50%, -50%) translate3d(30%, 0, 0);
  }
  50% {
    transform: translate(-50%, -50%) translate3d(30%, 30%, 0);
  }
  75% {
    transform: translate(-50%, -50%) translate3d(0, 30%, 0);
  }
  100% {
    transform: translate(-50%, -50%) translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .parking-spot.selected::before {
    animation: none;
  }
  .selected-blob {
    animation: none;
  }
}

/* 위치 코드 알약 뱃지: 주차칸 아래쪽 */
.slot-code {
  flex-shrink: 0;
  display: inline-block;
  padding: 0.375rem 0.9375rem;
  border-radius: 9999px;
  font-size: clamp(1.03125rem, 1.8vh, 1.3125rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-top: 0.375rem;
}
.slot-code.occupied {
  background: var(--border-light);
  color: var(--text-muted);
}
.slot-code.blocked {
  background: rgba(220, 53, 69, 0.15);
  color: var(--color-error, #dc3545);
}
.slot-code:not(.occupied):not(.blocked) {
  background: #ede9fe;
  color: var(--color-primary);
}

.slot-code.selected {
  background: #4338ca;
  color: #fff;
}

.slot-code.occupied.selected {
  background: #ad58fa;
  color: #fff;
}

/* exit/payment teal 테마: 장애인칸만 초록색 계열, 일반칸은 기존 보라색 유지 */
.parking-map--teal .parking-spot.selected.disabled {
  background: linear-gradient(180deg, #99f6e4 0%, #ccfbf1 50%, #f0fdfa 100%);
}
.parking-map--teal .parking-spot.selected.disabled::after {
  background: linear-gradient(
    180deg,
    rgba(153, 246, 228, 0.75) 0%,
    rgba(204, 251, 241, 0.75) 50%,
    rgba(240, 253, 250, 0.8) 100%
  );
}
.parking-map--teal .parking-spot.selected.disabled .selected-blob {
  background-color: #5eead4;
  opacity: 0.6;
}
.parking-map--teal .parking-spot.selected.disabled::before {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(94, 234, 212, 0) 40deg,
    rgba(94, 234, 212, 0.7) 70deg,
    rgba(94, 234, 212, 0) 110deg,
    transparent 360deg
  );
  animation: border-spin 1.8s linear infinite;
}
.parking-map--teal .slot-code.selected.disabled {
  background: #16d2c1;
  color: #fff;
}
.parking-map--teal .slot-code.occupied.selected.disabled {
  background: #16d2c1;
  color: #fff;
}

/* 장애인 주차칸 slot-code 글자 색상 */
.slot-code.disabled {
  color: var(--color-teal);
}

/* 장애인칸 + 점유 시: 일반 점유 칸과 동일한 글자 색상 */
.slot-code.occupied.disabled {
  color: var(--text-muted);
}

/* 칸 중앙: 차량 아이콘 또는 주차 가능 */
.spot-center {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
}

.car-icon-img {
  width: 58%;
  height: auto;
  max-height: 58%;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
  margin: 0 auto;
}

.available-text {
  font-size: clamp(0.9375rem, 1.8vh, 1.21875rem);
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.02em;
  margin-top: 1.3125rem;
}

.parking-spot.blocked .available-text {
  color: var(--color-error, #dc3545);
}

/* 장애인 아이콘: spot-center 우측 상단, slot-code와 동일 색상 */
.disabled-icon {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: calc(var(--icon-size) * 1.5);
  height: calc(var(--icon-size) * 1.5);
  color: var(--color-teal);
  display: block;
  flex-shrink: 0;
  z-index: 1;
}

.parking-info {
  flex-shrink: 0;
  width: 100%;
  max-width: min(38.4375rem, 92%);
  margin: 0 auto;
}

.info-text {
  background: var(--bg-card);
  padding: clamp(0.9375rem, 1.8vh, 1.125rem) clamp(1.125rem, 1.8vh, 1.3125rem);
  text-align: center;
  font-size: clamp(1.125rem, 1.8vh, 1.5rem);
  font-weight: 700;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: 0.625rem;
  box-sizing: border-box;
}

.info-text .label,
.info-text .value,
.info-text .divider {
  font-size: clamp(1.5rem, 1.8vh, 1.6875rem);
}

.label {
  color: var(--text-muted);
}

.divider {
  margin: 0 0.5rem;
  color: var(--text-muted);
}

.value {
  margin: 0 0.375rem;
  color: var(--color-primary);
}

.value--disabled {
  color: #16d2c1;
}

.value.full {
  color: var(--color-error);
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .parking-map {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .parking-grids-container {
    max-width: 100%;
  }

  .zone {
    padding: 0.5rem;
  }

  .parking-spot {
    padding: 0.3125rem 0.375rem 0.375rem;
  }

  .slot-code {
    padding: 0.28125rem 0.75rem;
    font-size: 1.03125rem;
  }

  .disabled-icon {
    width: 2.0625rem;
    height: 2.0625rem;
  }

  .info-text {
    padding: 0.9375rem 1.125rem;
    font-size: 1.125rem;
  }

  .info-text .label,
  .info-text .value,
  .info-text .divider {
    font-size: 1.125rem;
  }
}

/* 태블릿 (481px ~ 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .parking-grids-container {
    max-width: 35rem;
  }

  .info-text .label,
  .info-text .value,
  .info-text .divider {
    font-size: 1.21875rem;
  }
}

/* 데스크톱 (769px 이상) */
@media (min-width: 769px) {
  .parking-grids-container {
    max-width: 38.75rem;
  }

  .info-text .label,
  .info-text .value,
  .info-text .divider {
    font-size: 1.5rem;
  }
}
</style>
