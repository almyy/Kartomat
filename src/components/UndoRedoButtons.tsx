import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { useStore } from '../store'
import { IconButton, HStack } from '@chakra-ui/react'

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
      // Check for Ctrl+Z (undo) or Cmd+Z on Mac
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault()
        if (canUndo) {
          undo()
        }
      }
      // Check for Ctrl+Shift+Z (redo) or Cmd+Shift+Z on Mac
      else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (canRedo) {
          redo()
        }
      }
      // Also support Ctrl+Y for redo (common Windows shortcut)
      else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        if (canRedo) {
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, canRedo, undo, redo])

  return (
    <HStack 
      position="fixed" 
      bottom={4} 
      right={4} 
      gap={2} 
      zIndex={50}
      className="print:hidden"
    >
      <IconButton
        onClick={() => undo()}
        disabled={!canUndo}
        title={t('undoRedo.undoShortcut')}
        variant="subtle"
        colorPalette="gray"
        aria-label={t('undoRedo.undo')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          width="20"
          height="20"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
          />
        </svg>
      </IconButton>
      <IconButton
        onClick={() => redo()}
        disabled={!canRedo}
        title={t('undoRedo.redoShortcut')}
        variant="subtle"
        colorPalette="gray"
        aria-label={t('undoRedo.redo')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          width="20"
          height="20"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" 
          />
        </svg>
      </IconButton>
    </HStack>
  )
}
