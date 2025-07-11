const stopPropagation = (e) => e.stopPropagation()

export const vPreventPointerMovement = {
  mounted: (el) => {
    el.addEventListener('pointermove', stopPropagation)
    el.addEventListener('pointerup', stopPropagation)
    el.addEventListener('pointerdown', stopPropagation)
  },
  unmounted: (el) => {
    el.removeEventListener('pointermove', stopPropagation)
    el.removeEventListener('pointerup', stopPropagation)
    el.removeEventListener('pointerdown', stopPropagation)
  },
}
