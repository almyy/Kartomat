import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Constraint, CONSTRAINT_TYPES, PairConstraint, RowConstraint, FarApartConstraint, AbsoluteConstraint } from '../../cspSolver'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'

export function ConstraintManager() {
  const { t } = useTranslation()
  const constraints = useStore((state) => state.constraints)
  const students = useStore((state) => state.students)
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const addConstraint = useStore((state) => state.addConstraint)
  const removeConstraint = useStore((state) => state.removeConstraint)
  
  // Local state for temporary form inputs
  const [constraintType, setConstraintType] = useState<typeof CONSTRAINT_TYPES[keyof typeof CONSTRAINT_TYPES]>(CONSTRAINT_TYPES.NOT_TOGETHER)
  const [student1, setStudent1] = useState('')
  const [student2, setStudent2] = useState('')
  const [rowConstraint, setRowConstraint] = useState(0)
  const [colConstraint, setColConstraint] = useState(0)
  const [minDistance, setMinDistance] = useState(3)

  const handleAddConstraint = () => {
    if (constraintType === CONSTRAINT_TYPES.ABSOLUTE) {
      if (student1 && students.includes(student1)) {
        const row = parseInt(String(rowConstraint));
        const col = parseInt(String(colConstraint));
        
        // Validate row and column are within bounds
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
          return; // Invalid position, don't add constraint
        }
        
        const newConstraint: AbsoluteConstraint = {
          type: constraintType,
          student1,
          row,
          col
        }
        addConstraint(newConstraint)
        setStudent1('')
        setRowConstraint(0)
        setColConstraint(0)
      }
    } else if (constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW) {
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
          students.includes(student1) && students.includes(student2) &&
          minDistance > 0) {
        const newConstraint: FarApartConstraint = {
          type: constraintType,
          student1,
          student2,
          minDistance
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

  const handleColConstraintChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColConstraint(parseInt(e.target.value) || 0)
  }

  const handleMinDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setMinDistance(value > 0 ? value : 1)
  }

  const getConstraintDescription = (constraint: Constraint): string => {
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

  return (
    <CollapsibleSection title={t('constraints.title')} id="constraints">
      <div className="flex flex-col gap-2 mb-3 sm:mb-4 mt-3 sm:mt-4">
        <label htmlFor="constraint-type" className="sr-only">{t('constraints.typeLabel')}</label>
        <select
          id="constraint-type"
          value={constraintType}
          onChange={(e) => setConstraintType(e.target.value as typeof CONSTRAINT_TYPES[keyof typeof CONSTRAINT_TYPES])}
          className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
        >
          <option value={CONSTRAINT_TYPES.NOT_TOGETHER}>{t('constraints.types.notTogether')}</option>
          <option value={CONSTRAINT_TYPES.TOGETHER}>{t('constraints.types.together')}</option>
          <option value={CONSTRAINT_TYPES.MUST_BE_IN_ROW}>{t('constraints.types.mustBeInRow')}</option>
          <option value={CONSTRAINT_TYPES.FAR_APART}>{t('constraints.types.farApart')}</option>
          <option value={CONSTRAINT_TYPES.ABSOLUTE}>{t('constraints.types.absolute')}</option>
        </select>

        {constraintType === CONSTRAINT_TYPES.ABSOLUTE ? (
          <>
            <label htmlFor="absolute-student" className="sr-only">{t('constraints.selectStudent')}</label>
            <select
              id="absolute-student"
              value={student1}
              onChange={(e) => setStudent1(e.target.value)}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            >
              <option value="">{t('constraints.selectStudent')}</option>
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
              placeholder={t('constraints.rowNumber')}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            />
            <input
              type="number"
              min="0"
              max={cols - 1}
              value={colConstraint}
              onChange={handleColConstraintChange}
              placeholder={t('constraints.columnNumber')}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            />
          </>
        ) : constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW ? (
          <>
            <label htmlFor="row-student" className="sr-only">{t('constraints.selectStudent')}</label>
            <select
              id="row-student"
              value={student1}
              onChange={(e) => setStudent1(e.target.value)}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            >
              <option value="">{t('constraints.selectStudent')}</option>
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
              placeholder={t('constraints.rowNumber')}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            />
          </>
        ) : constraintType === CONSTRAINT_TYPES.FAR_APART ? (
          <>
            <label htmlFor="far-apart-student1" className="sr-only">{t('constraints.selectStudent1')}</label>
            <select
              id="far-apart-student1"
              value={student1}
              onChange={(e) => setStudent1(e.target.value)}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            >
              <option value="">{t('constraints.selectStudent1')}</option>
              {students.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label htmlFor="far-apart-student2" className="sr-only">{t('constraints.selectStudent2')}</label>
            <select
              id="far-apart-student2"
              value={student2}
              onChange={(e) => setStudent2(e.target.value)}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            >
              <option value="">{t('constraints.selectStudent2')}</option>
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
              placeholder={t('constraints.distanceUnits')}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            />
          </>
        ) : (
          <>
            <label htmlFor="pair-student1" className="sr-only">{t('constraints.selectStudent1')}</label>
            <select
              id="pair-student1"
              value={student1}
              onChange={(e) => setStudent1(e.target.value)}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            >
              <option value="">{t('constraints.selectStudent1')}</option>
              {students.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label htmlFor="pair-student2" className="sr-only">{t('constraints.selectStudent2')}</label>
            <select
              id="pair-student2"
              value={student2}
              onChange={(e) => setStudent2(e.target.value)}
              className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
            >
              <option value="">{t('constraints.selectStudent2')}</option>
              {students.filter(s => s !== student1).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        )}

        <button
          onClick={handleAddConstraint}
          className="px-4 py-2 rounded border border-white/20 bg-indigo-600/70 text-white cursor-pointer hover:bg-indigo-600/90 transition-colors text-sm sm:text-base"
        >
          {t('constraints.addButton')}
        </button>
      </div>

      <div className="flex flex-col gap-2 min-h-[50px]">
        {constraints.map((constraint, index) => (
          <div key={index} className="flex justify-between items-center gap-2 bg-white/5 px-2 sm:px-3 py-2 sm:py-3 rounded border border-white/10 text-sm sm:text-base">
            <span className="break-words">{getConstraintDescription(constraint)}</span>
            <button
              onClick={() => removeConstraint(index)}
              aria-label={t('constraints.removeLabel')}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/70 hover:bg-red-500/90 border-0 text-lg flex-shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
