import { ChangeEvent } from 'react'
import { useStore } from '../../store'
import { CONSTRAINT_TYPES, AbsoluteConstraint } from '../../cspSolver'
import { isValidStudent, isValidAbsolutePosition } from './constraintUtils'

export function useAbsoluteConstraintForm() {
  const students = useStore((state) => state.students)
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const addConstraint = useStore((state) => state.addConstraint)
  const absoluteStudent = useStore((state) => state.absoluteStudent)
  const absoluteRow = useStore((state) => state.absoluteRow)
  const absoluteCol = useStore((state) => state.absoluteCol)
  const setAbsoluteStudent = useStore((state) => state.setAbsoluteStudent)
  const setAbsoluteRow = useStore((state) => state.setAbsoluteRow)
  const setAbsoluteCol = useStore((state) => state.setAbsoluteCol)

  const handleAddConstraint = () => {
    if (isValidStudent(absoluteStudent, students)) {
      const row = parseInt(String(absoluteRow))
      const col = parseInt(String(absoluteCol))
      
      if (!isValidAbsolutePosition(row, col, rows, cols)) {
        return
      }
      
      const newConstraint: AbsoluteConstraint = {
        type: CONSTRAINT_TYPES.ABSOLUTE,
        student1: absoluteStudent,
        row,
        col
      }
      addConstraint(newConstraint)
      setAbsoluteStudent('')
      setAbsoluteRow(0)
      setAbsoluteCol(0)
    }
  }

  const handleRowChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAbsoluteRow(parseInt(e.target.value) || 0)
  }

  const handleColChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAbsoluteCol(parseInt(e.target.value) || 0)
  }

  return {
    handleAddConstraint,
    handleRowChange,
    handleColChange
  }
}
