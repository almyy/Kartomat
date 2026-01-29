import { useState } from 'react'
import { solveSeatingCSP, CONSTRAINT_TYPES } from './cspSolver'

function App() {
  const [students, setStudents] = useState([])
  const [studentInput, setStudentInput] = useState('')
  const [constraints, setConstraints] = useState([])
  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(6)
  const [seatingResult, setSeatingResult] = useState(null)
  
  // Constraint input state
  const [constraintType, setConstraintType] = useState(CONSTRAINT_TYPES.NOT_TOGETHER)
  const [student1, setStudent1] = useState('')
  const [student2, setStudent2] = useState('')
  const [rowConstraint, setRowConstraint] = useState(0)

  const addStudent = () => {
    const trimmed = studentInput.trim()
    if (trimmed && !students.includes(trimmed)) {
      setStudents([...students, trimmed])
      setStudentInput('')
    }
  }

  const removeStudent = (name) => {
    setStudents(students.filter(s => s !== name))
    // Also remove constraints involving this student
    setConstraints(constraints.filter(c => 
      c.student1 !== name && c.student2 !== name
    ))
  }

  const addConstraint = () => {
    if (constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW) {
      if (student1 && students.includes(student1)) {
        setConstraints([...constraints, {
          type: constraintType,
          student1,
          row: parseInt(rowConstraint)
        }])
        setStudent1('')
      }
    } else {
      if (student1 && student2 && student1 !== student2 && 
          students.includes(student1) && students.includes(student2)) {
        setConstraints([...constraints, {
          type: constraintType,
          student1,
          student2
        }])
        setStudent1('')
        setStudent2('')
      }
    }
  }

  const removeConstraint = (index) => {
    setConstraints(constraints.filter((_, i) => i !== index))
  }

  const solve = () => {
    const result = solveSeatingCSP(students, constraints, rows, cols)
    setSeatingResult(result)
  }

  const getConstraintDescription = (constraint) => {
    switch (constraint.type) {
      case CONSTRAINT_TYPES.NOT_TOGETHER:
        return `${constraint.student1} and ${constraint.student2} should NOT sit together`
      case CONSTRAINT_TYPES.TOGETHER:
        return `${constraint.student1} and ${constraint.student2} MUST sit together`
      case CONSTRAINT_TYPES.MUST_BE_IN_ROW:
        return `${constraint.student1} must sit in row ${constraint.row}`
      default:
        return 'Unknown constraint'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-center mb-2">Classroom Seating Solver</h1>
      <p className="text-center text-gray-400 mb-8">A Constraint Satisfaction Problem solver for optimal seating arrangements</p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          {/* Students Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="mt-0 mb-4 text-xl">Students</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                placeholder="Enter student name"
                className="flex-1 px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
              />
              <button 
                onClick={addStudent}
                className="px-4 py-2 rounded border border-white/20 bg-indigo-600/70 text-white cursor-pointer hover:bg-indigo-600/90 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[50px]">
              {students.map(name => (
                <div key={name} className="flex items-center gap-2 bg-indigo-600/30 px-3 py-2 rounded-full border border-indigo-600/50">
                  {name}
                  <button 
                    onClick={() => removeStudent(name)}
                    className="w-5 h-5 rounded-full flex items-center justify-center bg-red-500/70 hover:bg-red-500/90 border-0 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom Size Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="mt-0 mb-4 text-xl">Classroom Size</h2>
            <div className="flex gap-4 mb-2">
              <label className="flex flex-col gap-2 flex-1">
                Rows:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                  className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
                />
              </label>
              <label className="flex flex-col gap-2 flex-1">
                Columns:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                  className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
                />
              </label>
            </div>
            <p className="text-gray-400 text-sm m-0">Total seats: {rows * cols}</p>
          </div>

          {/* Constraints Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="mt-0 mb-4 text-xl">Constraints</h2>
            <div className="flex flex-col gap-2 mb-4">
              <select 
                value={constraintType} 
                onChange={(e) => setConstraintType(e.target.value)}
                className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
              >
                <option value={CONSTRAINT_TYPES.NOT_TOGETHER}>Not Together</option>
                <option value={CONSTRAINT_TYPES.TOGETHER}>Must Be Together</option>
                <option value={CONSTRAINT_TYPES.MUST_BE_IN_ROW}>Must Be In Row</option>
              </select>

              {constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW ? (
                <>
                  <select 
                    value={student1} 
                    onChange={(e) => setStudent1(e.target.value)}
                    className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
                  >
                    <option value="">Select student</option>
                    {students.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max={rows - 1}
                    value={rowConstraint}
                    onChange={(e) => setRowConstraint(e.target.value)}
                    placeholder="Row number"
                    className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
                  />
                </>
              ) : (
                <>
                  <select 
                    value={student1} 
                    onChange={(e) => setStudent1(e.target.value)}
                    className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
                  >
                    <option value="">Select student 1</option>
                    {students.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select 
                    value={student2} 
                    onChange={(e) => setStudent2(e.target.value)}
                    className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
                  >
                    <option value="">Select student 2</option>
                    {students.filter(s => s !== student1).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </>
              )}
              
              <button 
                onClick={addConstraint}
                className="px-4 py-2 rounded border border-white/20 bg-indigo-600/70 text-white cursor-pointer hover:bg-indigo-600/90 transition-colors"
              >
                Add Constraint
              </button>
            </div>

            <div className="flex flex-col gap-2 min-h-[50px]">
              {constraints.map((constraint, index) => (
                <div key={index} className="flex justify-between items-center bg-white/5 px-3 py-3 rounded border border-white/10">
                  {getConstraintDescription(constraint)}
                  <button 
                    onClick={() => removeConstraint(index)}
                    className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/70 hover:bg-red-500/90 border-0 text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Solve Button */}
          <button 
            onClick={solve}
            disabled={students.length === 0}
            className="bg-green-500/70 hover:bg-green-500/90 text-lg px-4 py-4 font-bold rounded border border-white/20 text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Solve Seating Arrangement
          </button>
        </div>

        {/* Results Panel */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 min-h-[400px]">
          <h2 className="mt-0 mb-4">Seating Arrangement</h2>
          {seatingResult && (
            <>
              {seatingResult.success ? (
                <div className="flex flex-col gap-2">
                  {seatingResult.seating.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 items-center">
                      <div className="text-sm text-gray-400 min-w-[50px]">Row {rowIndex}</div>
                      {row.map((seat, colIndex) => (
                        <div 
                          key={colIndex} 
                          className={`flex-1 min-h-[60px] flex items-center justify-center rounded text-sm font-medium border transition-all ${
                            seat 
                              ? 'bg-indigo-600/30 border-indigo-600/50 hover:bg-indigo-600/50 hover:scale-105' 
                              : 'bg-white/[0.02] border-white/10 border-dashed'
                          }`}
                        >
                          {seat || ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-red-500/20 border border-red-500/50 px-4 py-4 rounded text-red-400">
                  {seatingResult.message}
                </div>
              )}
            </>
          )}
          {!seatingResult && (
            <div className="flex items-center justify-center min-h-[300px] text-gray-400 text-center px-8">
              Add students and constraints, then click "Solve" to see the seating arrangement
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
