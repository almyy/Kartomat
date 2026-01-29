import { useTranslation } from 'react-i18next'

interface SolveButtonProps {
  onSolve: () => void
  disabled: boolean
}

export function SolveButton({ onSolve, disabled }: SolveButtonProps) {
  const { t } = useTranslation()
  
  return (
    <button
      onClick={onSolve}
      disabled={disabled}
      className="bg-green-500/70 hover:bg-green-500/90 text-base sm:text-lg px-4 py-3 sm:py-4 font-bold rounded border border-white/20 text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {t('solver.button')}
    </button>
  )
}
