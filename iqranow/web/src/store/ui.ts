import { create } from 'zustand'

interface UiState {
  fontScale: number
  setFontScale: (scale: number) => void
}

export const useUiStore = create<UiState>((set) => ({
  fontScale: Number(localStorage.getItem('fontScale') || 1),
  setFontScale: (scale: number) => {
    const clamped = Math.min(1.6, Math.max(0.8, Number(scale.toFixed(2))))
    localStorage.setItem('fontScale', String(clamped))
    document.documentElement.style.setProperty('--font-scale', String(clamped))
    set({ fontScale: clamped })
  },
}))

// Initialize on load
if (typeof window !== 'undefined') {
  const initialScale = Number(localStorage.getItem('fontScale') || 1)
  document.documentElement.style.setProperty('--font-scale', String(initialScale))
}
