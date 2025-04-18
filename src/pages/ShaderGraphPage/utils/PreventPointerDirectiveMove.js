const stopPropagation = (e) => e.stopPropagation()

export const vPreventPointerMovement = {
  mounted: (el) => {
    el.addEventListener('pointermove', stopPropagation)
    el.addEventListener('pointerup', stopPropagation)
    el.addEventListener('pointerdown', stopPropagation)
  },
  unmounted: (el) => {
    el.addEventListener('pointermove', stopPropagation)
    el.addEventListener('pointerup', stopPropagation)
    el.addEventListener('pointerdown', stopPropagation)
  },
}
