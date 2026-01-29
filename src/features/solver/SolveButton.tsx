interface SolveButtonProps {
  onSolve: () => void
  disabled: boolean
}

export function SolveButton({ onSolve, disabled }: SolveButtonProps) {
  return (
    <button
      onClick={onSolve}
      disabled={disabled}
      className="bg-green-500/70 hover:bg-green-500/90 text-lg px-4 py-4 font-bold rounded border border-white/20 text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Solve Seating Arrangement
    </button>
  )
}
