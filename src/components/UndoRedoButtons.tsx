import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { useStore } from '../store'

export function UndoRedoButtons() {
  const { t } = useTranslation()
  
  // Access temporal state reactively
  const { undo, redo, pastStates, futureStates } = useStoreWithEqualityFn(
    useStore.temporal,
    (state) => state
  )

  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const temporalState = useStore.temporal.getState()
      
      // Check for Ctrl+Z (undo) or Cmd+Z on Mac
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault()
        if (temporalState.pastStates.length > 0) {
          temporalState.undo()
        }
      }
      // Check for Ctrl+Shift+Z (redo) or Cmd+Shift+Z on Mac
      else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (temporalState.futureStates.length > 0) {
          temporalState.redo()
        }
      }
      // Also support Ctrl+Y for redo (common Windows shortcut)
      else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        if (temporalState.futureStates.length > 0) {
          temporalState.redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <button
        onClick={() => undo()}
        disabled={!canUndo}
        title={t('undoRedo.undoShortcut')}
        className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg backdrop-blur-sm border border-white/20"
        aria-label={t('undoRedo.undo')}
      >
        <span className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
            />
          </svg>
          <span className="hidden sm:inline">{t('undoRedo.undo')}</span>
        </span>
      </button>
      <button
        onClick={() => redo()}
        disabled={!canRedo}
        title={t('undoRedo.redoShortcut')}
        className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg backdrop-blur-sm border border-white/20"
        aria-label={t('undoRedo.redo')}
      >
        <span className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" 
            />
          </svg>
          <span className="hidden sm:inline">{t('undoRedo.redo')}</span>
        </span>
      </button>
    </div>
  )
}
