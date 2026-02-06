import { onMounted, onUnmounted, type Ref } from 'vue'

const DESIGN_WIDTH = 800
const DESIGN_HEIGHT = 500

function updateScale(el: HTMLElement | null) {
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight
  const scale = Math.min(1, w / DESIGN_WIDTH, h / DESIGN_HEIGHT)
  el.style.setProperty('--bottom-scale', String(scale))
}

/**
 * bottom-section(ref) 크기에 맞춰 내부 .bottom-section__fit을 비율 유지하며 스케일합니다.
 * 800×500 기준으로 min(section폭/800, section높이/500)을 --bottom-scale로 설정합니다.
 */
export function useBottomSectionScale(sectionRef: Ref<HTMLElement | null>) {
  let observer: ResizeObserver | null = null

  onMounted(() => {
    const el = sectionRef.value
    if (!el) return
    updateScale(el)
    observer = new ResizeObserver(() => updateScale(sectionRef.value))
    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
