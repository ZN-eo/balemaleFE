<template></template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { defineComponent } from 'vue'
import { useWsStore } from '@/stores/wsStore'
import { subscribeRobotEvent, unsubscribeRobotEvent } from '@/api/websocket/wsApi'

export default defineComponent({
  name: 'DummyView',
  props: {},
  setup(props) {
    const wsStore = useWsStore()
    // 참고하고 나중에 삭제할 것
    watch(
      () => wsStore.lastRobotEvent,
      (newData) => {
        if (newData) {
          console.log('WebSocket 데이터 스토어 반영:', newData)
        }
      },
      { deep: true, immediate: true }
    )
    onMounted(() => {
      console.log('구독 시작')
      subscribeRobotEvent((data) => {
        console.log('데이터 수신:', data)
        wsStore.setLastRobotEvent(data)
      })
    })

    onUnmounted(() => {
      unsubscribeRobotEvent()
      console.log('구독 해제')
    })

    return {
      wsStore
    }
  }
})
</script>

<style scoped></style>
