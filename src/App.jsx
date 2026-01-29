import { useState } from 'react'
import './App.css'
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
    <div className="app">
      <h1>Classroom Seating Solver</h1>
      <p className="subtitle">A Constraint Satisfaction Problem solver for optimal seating arrangements</p>
      
      <div className="main-container">
        <div className="input-panel">
          {/* Students Section */}
          <div className="section">
            <h2>Students</h2>
            <div className="input-group">
              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                placeholder="Enter student name"
              />
              <button onClick={addStudent}>Add</button>
            </div>
            <div className="student-list">
              {students.map(name => (
                <div key={name} className="student-chip">
                  {name}
                  <button onClick={() => removeStudent(name)}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom Size Section */}
          <div className="section">
            <h2>Classroom Size</h2>
            <div className="size-inputs">
              <label>
                Rows:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                />
              </label>
              <label>
                Columns:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                />
              </label>
            </div>
            <p className="info">Total seats: {rows * cols}</p>
          </div>

          {/* Constraints Section */}
          <div className="section">
            <h2>Constraints</h2>
            <div className="constraint-inputs">
              <select 
                value={constraintType} 
                onChange={(e) => setConstraintType(e.target.value)}
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
                  />
                </>
              ) : (
                <>
                  <select 
                    value={student1} 
                    onChange={(e) => setStudent1(e.target.value)}
                  >
                    <option value="">Select student 1</option>
                    {students.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select 
                    value={student2} 
                    onChange={(e) => setStudent2(e.target.value)}
                  >
                    <option value="">Select student 2</option>
                    {students.filter(s => s !== student1).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </>
              )}
              
              <button onClick={addConstraint}>Add Constraint</button>
            </div>

            <div className="constraint-list">
              {constraints.map((constraint, index) => (
                <div key={index} className="constraint-item">
                  {getConstraintDescription(constraint)}
                  <button onClick={() => removeConstraint(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Solve Button */}
          <button 
            className="solve-button" 
            onClick={solve}
            disabled={students.length === 0}
          >
            Solve Seating Arrangement
          </button>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <h2>Seating Arrangement</h2>
          {seatingResult && (
            <>
              {seatingResult.success ? (
                <div className="seating-chart">
                  {seatingResult.seating.map((row, rowIndex) => (
                    <div key={rowIndex} className="seating-row">
                      <div className="row-label">Row {rowIndex}</div>
                      {row.map((seat, colIndex) => (
                        <div 
                          key={colIndex} 
                          className={`seat ${seat ? 'occupied' : 'empty'}`}
                        >
                          {seat || ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="error-message">
                  {seatingResult.message}
                </div>
              )}
            </>
          )}
          {!seatingResult && (
            <div className="placeholder">
              Add students and constraints, then click "Solve" to see the seating arrangement
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
