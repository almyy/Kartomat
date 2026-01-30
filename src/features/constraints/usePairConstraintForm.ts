import { useStore } from '../../store'
import { CONSTRAINT_TYPES, PairConstraint } from '../../cspSolver'
import { isValidStudentPair } from './constraintUtils'

export function usePairConstraintForm() {
  const students = useStore((state) => state.students)
  const addConstraint = useStore((state) => state.addConstraint)
  const constraintType = useStore((state) => state.constraintType)
  const pairStudent1 = useStore((state) => state.pairStudent1)
  const pairStudent2 = useStore((state) => state.pairStudent2)
  const setPairStudent1 = useStore((state) => state.setPairStudent1)
  const setPairStudent2 = useStore((state) => state.setPairStudent2)

  const handleAddConstraint = () => {
    if (isValidStudentPair(pairStudent1, pairStudent2, students)) {
      const newConstraint: PairConstraint = {
        type: constraintType as typeof CONSTRAINT_TYPES.NOT_TOGETHER | typeof CONSTRAINT_TYPES.TOGETHER,
        student1: pairStudent1,
        student2: pairStudent2
      }
      addConstraint(newConstraint)
      setPairStudent1('')
      setPairStudent2('')
    }
  }

  return {
    handleAddConstraint
  }
}
