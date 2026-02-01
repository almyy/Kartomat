import { useTranslation } from 'react-i18next'
import { Button } from '@mantine/core'

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
      color="teal"
      size="lg"
      className="font-bold"
      fullWidth
    >
      {t('solver.button')}
    </Button>
  )
}
