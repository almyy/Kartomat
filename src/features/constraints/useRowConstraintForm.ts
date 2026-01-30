import { ChangeEvent } from 'react'
import { useStore } from '../../store'
import { CONSTRAINT_TYPES, RowConstraint } from '../../cspSolver'
import { isValidStudent } from './constraintUtils'

export function useRowConstraintForm() {
  const students = useStore((state) => state.students)
  const addConstraint = useStore((state) => state.addConstraint)
  const rowStudent = useStore((state) => state.rowStudent)
  const rowNumber = useStore((state) => state.rowNumber)
  const setRowStudent = useStore((state) => state.setRowStudent)
  const setRowNumber = useStore((state) => state.setRowNumber)

  const handleAddConstraint = () => {
    if (isValidStudent(rowStudent, students)) {
      const newConstraint: RowConstraint = {
        type: CONSTRAINT_TYPES.MUST_BE_IN_ROW,
        student1: rowStudent,
        row: parseInt(String(rowNumber))
      }
      addConstraint(newConstraint)
      setRowStudent('')
    }
  }

  const handleRowNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRowNumber(parseInt(e.target.value) || 0)
  }

  return {
    handleAddConstraint,
    handleRowNumberChange
  }
}
