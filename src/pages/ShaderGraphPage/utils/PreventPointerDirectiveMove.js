export const vPreventPointerMovement = {
  mounted: (el, binding) => {
    const stopPropagation = (e) => {
      if (!binding.disable) e.stopPropagation()
    }
    el._stopPropagation = stopPropagation
    el.addEventListener('pointermove', el._stopPropagation)
    el.addEventListener('pointerup', el._stopPropagation)
    el.addEventListener('pointerdown', el._stopPropagation)
  },
  unmounted: (el) => {
    if (el._stopPropagation) {
      el.removeEventListener('pointermove', el._stopPropagation)
      el.removeEventListener('pointerup', el._stopPropagation)
      el.removeEventListener('pointerdown', el._stopPropagation)
    }
  },
}
