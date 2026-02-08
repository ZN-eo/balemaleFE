<template>
  <div class="robot-status">
    <span ref="statusIconRef" class="robot-status-icon" aria-hidden="true" />
    <span class="robot-status-label">주차로봇</span>
    <span :class="['robot-status-value', displayStatusClass]">
      {{ displayLabel }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useWsStore } from '@/stores/wsStore'
import { subscribeRobotEvent, unsubscribeRobotEvent } from '@/api/websocket/wsApi'
import type { RobotEventType } from '@/api/websocket/wsApi'
import lottie from 'lottie-web'
import enteringAnimation from '@/assets/icons/robot/entering.json'
import exitingAnimation from '@/assets/icons/robot/exiting.json'
import waitingAnimation from '@/assets/icons/robot/waiting.json'
import estopAnimation from '@/assets/icons/robot/estop.json'

const ROBOT_ICON_ANIMATIONS: Record<RobotEventType, object> = {
  ENTERING: enteringAnimation as object,
  EXITING: exitingAnimation as object,
  WAITING: waitingAnimation as object,
  ESTOP: estopAnimation as object,
  FAILED: estopAnimation as object
}

const ROBOT_EVENT_LABELS: Record<RobotEventType, string> = {
  ENTERING: '입차중',
  EXITING: '출차중',
  WAITING: '대기중',
  ESTOP: '일시멈춤',
  FAILED: '실패'
}

function eventTypeClass(type: RobotEventType): string {
  if (type === 'ESTOP' || type === 'FAILED') return 'badge--danger' // 일시멈춤
  if (type === 'WAITING') return 'badge--info' // 대기중
  return 'badge--primary'
}

export default defineComponent({
  name: 'RobotStatus',
  setup() {
    const wsStore = useWsStore()
    const { lastRobotEvent } = storeToRefs(wsStore)
    const statusIconRef = ref<HTMLElement | null>(null)
    let lottieInstance: ReturnType<typeof lottie.loadAnimation> | null = null

    /** 이벤트 없을 때는 대기중 아이콘, 있을 때는 상태별 아이콘 */
    const currentIconAnimation = computed(() => {
      const type = lastRobotEvent.value?.robotOperationStatus
      return type != null ? (ROBOT_ICON_ANIMATIONS[type] ?? waitingAnimation) : (waitingAnimation as object)
    })

    const statusLabel = computed(() => {
      const type = lastRobotEvent.value?.robotOperationStatus
      return type != null ? (ROBOT_EVENT_LABELS[type] ?? type) : '대기중'
    })

    const statusClass = computed(() => {
      const type = lastRobotEvent.value?.robotOperationStatus
      return type != null ? eventTypeClass(type) : 'badge--info'
    })

    const displayLabel = computed(() => (lastRobotEvent.value ? statusLabel.value : '대기중'))
    const displayStatusClass = computed(() => (lastRobotEvent.value ? statusClass.value : 'badge--info'))

    watch(
      currentIconAnimation,
      async (animationData) => {
        lottieInstance?.destroy()
        lottieInstance = null
        await nextTick()
        if (!statusIconRef.value) return
        lottieInstance = lottie.loadAnimation({
          container: statusIconRef.value,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData as object
        })
      },
      { immediate: true }
    )

    onMounted(() => {
      subscribeRobotEvent((data) => {
        wsStore.setRobotEvent(data)
      })
    })

    onUnmounted(() => {
      unsubscribeRobotEvent()
      lottieInstance?.destroy()
      lottieInstance = null
    })

    return {
      lastRobotEvent,
      statusLabel,
      statusClass,
      displayLabel,
      displayStatusClass,
      statusIconRef
    }
  }
})
</script>

<style scoped>
.robot-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  padding: 1.25rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  color: var(--color-teal);
  font-weight: 700;
  font-size: clamp(1rem, 1.2vh, 1.125rem);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.robot-status-icon {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}

.robot-status-label {
  color: var(--color-teal);
}

.robot-status-value {
  color: var(--color-teal);
}

.robot-status-waiting {
  opacity: 0.9;
  font-size: clamp(1.5rem, 1.8vh, 1.6875rem);
}

.badge--primary {
  color: var(--color-teal);
}

.badge--info {
  color: var(--color-teal-light, #0dcaf0);
}

.badge--danger {
  color: #dc3545;
}

.robot-status .badge--primary,
.robot-status .badge--info,
.robot-status .badge--danger {
  background: transparent;
  padding: 0;
}

.robot-plate {
  font-size: 0.9em;
  font-weight: 600;
  color: var(--text-primary, #333);
  margin-left: 4px;
}
</style>
