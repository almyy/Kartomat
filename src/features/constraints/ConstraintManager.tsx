import { ChangeEvent, useState } from 'react'
import { Constraint, CONSTRAINT_TYPES, PairConstraint, RowConstraint, FarApartConstraint } from '../../cspSolver'
import { useStore } from '../../store'

export function ConstraintManager() {
  const constraints = useStore((state) => state.constraints)
  const students = useStore((state) => state.students)
  const rows = useStore((state) => state.rows)
  const addConstraint = useStore((state) => state.addConstraint)
  const removeConstraint = useStore((state) => state.removeConstraint)
  
  // Local state for temporary form inputs
  const [constraintType, setConstraintType] = useState<typeof CONSTRAINT_TYPES[keyof typeof CONSTRAINT_TYPES]>(CONSTRAINT_TYPES.NOT_TOGETHER)
  const [student1, setStudent1] = useState('')
  const [student2, setStudent2] = useState('')
  const [rowConstraint, setRowConstraint] = useState(0)
  const [minDistance, setMinDistance] = useState(3)

  const handleAddConstraint = () => {
    if (constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW) {
      if (student1 && students.includes(student1)) {
        const newConstraint: RowConstraint = {
          type: constraintType,
          student1,
          row: parseInt(String(rowConstraint))
        }
        addConstraint(newConstraint)
        setStudent1('')
      }
    } else if (constraintType === CONSTRAINT_TYPES.FAR_APART) {
      if (student1 && student2 && student1 !== student2 && 
          students.includes(student1) && students.includes(student2)) {
        const newConstraint: FarApartConstraint = {
          type: constraintType,
          student1,
          student2,
          minDistance: parseFloat(String(minDistance))
        }
        addConstraint(newConstraint)
        setStudent1('')
        setStudent2('')
      }
    } else {
      if (student1 && student2 && student1 !== student2 && 
          students.includes(student1) && students.includes(student2)) {
        const newConstraint: PairConstraint = {
          type: constraintType as typeof CONSTRAINT_TYPES.NOT_TOGETHER | typeof CONSTRAINT_TYPES.TOGETHER,
          student1,
          student2
        }
        addConstraint(newConstraint)
        setStudent1('')
        setStudent2('')
      }
    }
  }

  const handleRowConstraintChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRowConstraint(parseInt(e.target.value) || 0)
  }

  const handleMinDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinDistance(parseFloat(e.target.value) || 3)
  }

  const getConstraintDescription = (constraint: Constraint): string => {
    switch (constraint.type) {
      case CONSTRAINT_TYPES.NOT_TOGETHER: {
        const pairConstraint = constraint as PairConstraint
        return `${pairConstraint.student1} and ${pairConstraint.student2} should NOT sit together`
      }
      case CONSTRAINT_TYPES.TOGETHER: {
        const pairConstraint = constraint as PairConstraint
        return `${pairConstraint.student1} and ${pairConstraint.student2} MUST sit together`
      }
      case CONSTRAINT_TYPES.MUST_BE_IN_ROW: {
        const rowConstraintTyped = constraint as RowConstraint
        return `${rowConstraintTyped.student1} must sit in row ${rowConstraintTyped.row}`
      }
      case CONSTRAINT_TYPES.FAR_APART: {
        const farApartConstraint = constraint as FarApartConstraint
        return `${farApartConstraint.student1} and ${farApartConstraint.student2} must sit at least ${farApartConstraint.minDistance} units apart`
      }
      default:
        return 'Unknown constraint'
    }
  }

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h2 className="mt-0 mb-4 text-xl">Constraints</h2>
      <div className="flex flex-col gap-2 mb-4">
        <select
          value={constraintType}
          onChange={(e) => setConstraintType(e.target.value as typeof CONSTRAINT_TYPES[keyof typeof CONSTRAINT_TYPES])}
          className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
        >
          <option value={CONSTRAINT_TYPES.NOT_TOGETHER}>Not Together</option>
          <option value={CONSTRAINT_TYPES.TOGETHER}>Must Be Together</option>
          <option value={CONSTRAINT_TYPES.MUST_BE_IN_ROW}>Must Be In Row</option>
          <option value={CONSTRAINT_TYPES.FAR_APART}>Far Apart</option>
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
              onChange={handleRowConstraintChange}
              placeholder="Row number"
              className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
            />
          </>
        ) : constraintType === CONSTRAINT_TYPES.FAR_APART ? (
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
            <input
              type="number"
              min="1"
              step="0.5"
              value={minDistance}
              onChange={handleMinDistanceChange}
              placeholder="Minimum distance (e.g., 3)"
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
          onClick={handleAddConstraint}
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
              aria-label="Remove constraint"
              className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/70 hover:bg-red-500/90 border-0 text-lg"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
