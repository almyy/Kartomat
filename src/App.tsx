import { useState } from 'react'
import { solveSeatingCSP, CONSTRAINT_TYPES, Constraint, SeatingResult, ConstraintType, RowConstraint, PairConstraint } from './cspSolver'
import { StudentManager } from './features/students'
import { ClassroomConfig } from './features/classroom'
import { ConstraintManager } from './features/constraints'
import { SeatingDisplay } from './features/seating'
import { SolveButton } from './features/solver'

function App() {
  const [students, setStudents] = useState<string[]>([])
  const [studentInput, setStudentInput] = useState<string>('')
  const [constraints, setConstraints] = useState<Constraint[]>([])
  const [rows, setRows] = useState<number>(4)
  const [cols, setCols] = useState<number>(6)
  const [seatingResult, setSeatingResult] = useState<SeatingResult | null>(null)
  
  // Constraint input state
  const [constraintType, setConstraintType] = useState<ConstraintType>(CONSTRAINT_TYPES.NOT_TOGETHER)
  const [student1, setStudent1] = useState<string>('')
  const [student2, setStudent2] = useState<string>('')
  const [rowConstraint, setRowConstraint] = useState<number>(0)

  const addStudent = () => {
    const trimmed = studentInput.trim()
    if (trimmed && !students.includes(trimmed)) {
      setStudents([...students, trimmed])
      setStudentInput('')
    }
  }

  const removeStudent = (name: string) => {
    setStudents(students.filter(s => s !== name))
    // Also remove constraints involving this student
    setConstraints(constraints.filter(c => 
      c.student1 !== name && !('student2' in c && c.student2 === name)
    ))
  }

  const addConstraint = () => {
    if (constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW) {
      if (student1 && students.includes(student1)) {
        const newConstraint: RowConstraint = {
          type: constraintType,
          student1,
          row: parseInt(String(rowConstraint))
        }
        setConstraints([...constraints, newConstraint])
        setStudent1('')
      }
    } else {
      if (student1 && student2 && student1 !== student2 && 
          students.includes(student1) && students.includes(student2)) {
        const newConstraint: PairConstraint = {
          type: constraintType as typeof CONSTRAINT_TYPES.NOT_TOGETHER | typeof CONSTRAINT_TYPES.TOGETHER,
          student1,
          student2
        }
        setConstraints([...constraints, newConstraint])
        setStudent1('')
        setStudent2('')
      }
    }
  }

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index))
  }

  const solve = () => {
    const result = solveSeatingCSP(students, constraints, rows, cols)
    setSeatingResult(result)
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-center mb-2">Classroom Seating Solver</h1>
      <p className="text-center text-gray-400 mb-8">A Constraint Satisfaction Problem solver for optimal seating arrangements</p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <StudentManager
            students={students}
            studentInput={studentInput}
            setStudentInput={setStudentInput}
            onAddStudent={addStudent}
            onRemoveStudent={removeStudent}
          />

          <ClassroomConfig
            rows={rows}
            cols={cols}
            onRowsChange={setRows}
            onColsChange={setCols}
          />

          <ConstraintManager
            constraints={constraints}
            students={students}
            constraintType={constraintType}
            student1={student1}
            student2={student2}
            rowConstraint={rowConstraint}
            rows={rows}
            onConstraintTypeChange={setConstraintType}
            onStudent1Change={setStudent1}
            onStudent2Change={setStudent2}
            onRowConstraintChange={setRowConstraint}
            onAddConstraint={addConstraint}
            onRemoveConstraint={removeConstraint}
          />

          <SolveButton
            onSolve={solve}
            disabled={students.length === 0}
          />
        </div>

        <SeatingDisplay seatingResult={seatingResult} />
      </div>
    </div>
  )
}

export default App
