import { useTranslation } from 'react-i18next'
import { solveSeatingCSP } from './cspSolver'
import { StudentManager } from './features/students'
import { ClassroomConfig } from './features/classroom'
import { ConstraintManager } from './features/constraints'
import { SeatingDisplay } from './features/seating'
import { SolveButton } from './features/solver'
import { LanguageSelector } from './components/LanguageSelector'
import { useStore } from './store'

function App() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const constraints = useStore((state) => state.constraints)
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const layout = useStore((state) => state.layout)
  const seatGenders = useStore((state) => state.seatGenders)
  const setSeatingResult = useStore((state) => state.setSeatingResult)

  const solve = () => {
    const studentNames = students.map(s => s.name)
    const studentGenders = students.reduce((acc, s) => {
      acc[s.name] = s.gender
      return acc
    }, {} as Record<string, 'male' | 'female' | undefined>)
    const result = solveSeatingCSP(studentNames, constraints, rows, cols, layout, seatGenders, studentGenders)
    setSeatingResult(result)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4 sm:mb-2">
        <div className="flex-1 w-full">
          <h1 className="text-center mb-1 sm:mb-2">{t('app.title')}</h1>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-4 sm:mb-8">{t('app.subtitle')}</p>
        </div>
        <LanguageSelector />
      </div>
      
      <div className="flex flex-row flex-wrap gap-4 sm:gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 flex-1 min-w-[300px]">
          <StudentManager />
          <ClassroomConfig />
          <ConstraintManager />
          <SolveButton onSolve={solve} disabled={students.length === 0} />
        </div>

        <div className="w-full">
          <SeatingDisplay />
        </div>
      </div>
    </div>
  )
}

export default App
