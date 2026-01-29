import { ChangeEvent } from 'react'
import { Constraint, ConstraintType, CONSTRAINT_TYPES, PairConstraint, RowConstraint } from '../../cspSolver'

interface ConstraintManagerProps {
  constraints: Constraint[]
  students: string[]
  constraintType: ConstraintType
  student1: string
  student2: string
  rowConstraint: number
  rows: number
  onConstraintTypeChange: (type: ConstraintType) => void
  onStudent1Change: (student: string) => void
  onStudent2Change: (student: string) => void
  onRowConstraintChange: (row: number) => void
  onAddConstraint: () => void
  onRemoveConstraint: (index: number) => void
}

export function ConstraintManager({
  constraints,
  students,
  constraintType,
  student1,
  student2,
  rowConstraint,
  rows,
  onConstraintTypeChange,
  onStudent1Change,
  onStudent2Change,
  onRowConstraintChange,
  onAddConstraint,
  onRemoveConstraint,
}: ConstraintManagerProps) {
  const handleRowConstraintChange = (e: ChangeEvent<HTMLInputElement>) => {
    onRowConstraintChange(parseInt(e.target.value) || 0)
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
          onChange={(e) => onConstraintTypeChange(e.target.value as ConstraintType)}
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
              onChange={(e) => onStudent1Change(e.target.value)}
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
        ) : (
          <>
            <select
              value={student1}
              onChange={(e) => onStudent1Change(e.target.value)}
              className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
            >
              <option value="">Select student 1</option>
              {students.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={student2}
              onChange={(e) => onStudent2Change(e.target.value)}
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
          onClick={onAddConstraint}
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
              onClick={() => onRemoveConstraint(index)}
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
