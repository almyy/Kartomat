import { solveSeatingCSP } from './cspSolver'
import { StudentManager } from './features/students'
import { ClassroomConfig } from './features/classroom'
import { ConstraintManager } from './features/constraints'
import { SeatingDisplay } from './features/seating'
import { SolveButton } from './features/solver'
import { useStore } from './store'

function App() {
  const students = useStore((state) => state.students)
  const constraints = useStore((state) => state.constraints)
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const layout = useStore((state) => state.layout)
  const setSeatingResult = useStore((state) => state.setSeatingResult)

  const solve = () => {
    const result = solveSeatingCSP(students, constraints, rows, cols, layout)
    setSeatingResult(result)
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-center mb-2">Classroom Seating Solver</h1>
      <p className="text-center text-gray-400 mb-8">A Constraint Satisfaction Problem solver for optimal seating arrangements</p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <StudentManager />
          <ClassroomConfig />
          <ConstraintManager />
          <SolveButton onSolve={solve} disabled={students.length === 0} />
        </div>

        <SeatingDisplay />
      </div>
    </div>
  )
}

export default App
