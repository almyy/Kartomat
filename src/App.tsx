import { useTranslation } from 'react-i18next'
import { solveSeatingCSP } from './cspSolver'
import { StudentManager } from './features/students'
import { ClassroomConfig } from './features/classroom'
import { ConstraintManager } from './features/constraints'
import { SeatingDisplay } from './features/seating'
import { SolveButton } from './features/solver'
import { LanguageSelector } from './components/LanguageSelector'
import { UndoRedoButtons } from './components/UndoRedoButtons'
import { useStore } from './store'

function App() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const constraints = useStore((state) => state.constraints)
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const seatState = useStore((state) => state.seatState)
  const setSeatingResult = useStore((state) => state.setSeatingResult)

  const solve = () => {
    // Convert seatState to Seat objects for solver
    const seatLayout = seatState.map(row => row.map(state => ({
      available: state !== 'off',
      gender: state === 'm' ? 'male' as const : state === 'f' ? 'female' as const : 'any' as const
    })))
    
    const result = solveSeatingCSP(students, constraints, rows, cols, seatLayout)
    setSeatingResult(result)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="relative mb-4 sm:mb-2 print:hidden">
        <div className="absolute top-0 right-0">
          <LanguageSelector />
        </div>
        <div className="w-full">
          <h1 className="text-center mb-1 sm:mb-2">{t('app.title')}</h1>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-4 sm:mb-8">{t('app.subtitle')}</p>
        </div>
      </div>
      
      <div className="flex flex-row flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full max-w-2xl print:hidden">
          <StudentManager />
          <ClassroomConfig />
          <ConstraintManager />
          <SolveButton onSolve={solve} disabled={students.length === 0} />
        </div>

        <div className="w-full max-w-2xl">
          <SeatingDisplay />
        </div>
      </div>

      <UndoRedoButtons />
    </div>
  )
}

export default App
