import { useUiStore } from '../store/ui'

export default function AccessibilityToolbar() {
  const fontScale = useUiStore(s => s.fontScale)
  const setFontScale = useUiStore(s => s.setFontScale)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-surface/90 backdrop-blur border border-white/10 shadow-xl rounded-full px-3 py-2" role="region" aria-label="Accessibility tools">
      <button aria-label="Decrease font size" className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20" onClick={() => setFontScale(fontScale - 0.1)}>-A</button>
      <div className="text-white/60 text-xs">{Math.round(fontScale * 100)}%</div>
      <button aria-label="Increase font size" className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20" onClick={() => setFontScale(fontScale + 0.1)}>+A</button>
    </div>
  )
}
