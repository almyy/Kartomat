import { TFunction } from 'i18next'
import { Constraint, CONSTRAINT_TYPES, PairConstraint, RowConstraint, FarApartConstraint, AbsoluteConstraint } from '../../cspSolver'

export function getConstraintDescription(constraint: Constraint, t: TFunction): string {
  switch (constraint.type) {
    case CONSTRAINT_TYPES.ABSOLUTE: {
      const absoluteConstraint = constraint as AbsoluteConstraint
      return t('constraints.descriptions.absolute', {
        student: absoluteConstraint.student1,
        row: absoluteConstraint.row,
        col: absoluteConstraint.col
      })
    }
    case CONSTRAINT_TYPES.NOT_TOGETHER: {
      const pairConstraint = constraint as PairConstraint
      return t('constraints.descriptions.notTogether', {
        student1: pairConstraint.student1,
        student2: pairConstraint.student2
      })
    }
    case CONSTRAINT_TYPES.TOGETHER: {
      const pairConstraint = constraint as PairConstraint
      return t('constraints.descriptions.together', {
        student1: pairConstraint.student1,
        student2: pairConstraint.student2
      })
    }
    case CONSTRAINT_TYPES.MUST_BE_IN_ROW: {
      const rowConstraintTyped = constraint as RowConstraint
      return t('constraints.descriptions.mustBeInRow', {
        student: rowConstraintTyped.student1,
        row: rowConstraintTyped.row
      })
    }
    case CONSTRAINT_TYPES.FAR_APART: {
      const farApartConstraint = constraint as FarApartConstraint
      return t('constraints.descriptions.farApart', {
        student1: farApartConstraint.student1,
        student2: farApartConstraint.student2,
        distance: farApartConstraint.minDistance
      })
    }
    default:
      return t('constraints.descriptions.unknown')
  }
}

export function isValidAbsolutePosition(row: number, col: number, rows: number, cols: number): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols
}

export function isValidStudentPair(student1: string, student2: string, students: string[]): boolean {
  return student1 !== '' && student2 !== '' && student1 !== student2 && 
         students.includes(student1) && students.includes(student2)
}

export function isValidStudent(student: string, students: string[]): boolean {
  return student !== '' && students.includes(student)
}
