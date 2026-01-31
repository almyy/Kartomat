import { useTranslation } from 'react-i18next'
import { Button } from '../../components'

interface SolveButtonProps {
  onSolve: () => void
  disabled: boolean
}

export function SolveButton({ onSolve, disabled }: SolveButtonProps) {
  const { t } = useTranslation()
  
  return (
    <Button
      onClick={onSolve}
      disabled={disabled}
      variant="success"
      size="lg"
      className="font-bold"
    >
      {t('solver.button')}
    </Button>
  )
}
