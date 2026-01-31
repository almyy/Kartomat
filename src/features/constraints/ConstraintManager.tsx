import { useTranslation } from 'react-i18next'
import { CONSTRAINT_TYPES } from '../../cspSolver'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'
import { getConstraintDescription } from './constraintUtils'
import { PairConstraintForm } from './PairConstraintForm'
import { RowConstraintForm } from './RowConstraintForm'
import { FarApartConstraintForm } from './FarApartConstraintForm'
import { AbsoluteConstraintForm } from './AbsoluteConstraintForm'

export function ConstraintManager() {
  const { t } = useTranslation()
  const constraints = useStore((state) => state.constraints)
  const removeConstraint = useStore((state) => state.removeConstraint)
  const constraintType = useStore((state) => state.constraintType)
  const setConstraintType = useStore((state) => state.setConstraintType)

  return (
    <CollapsibleSection title={t('constraints.title')} id="constraints">
      <div className="flex flex-col gap-2 mb-3 sm:mb-4 mt-3 sm:mt-4">
        <label htmlFor="constraint-type" className="sr-only">{t('constraints.typeLabel')}</label>
        <select
          id="constraint-type"
          value={constraintType}
          onChange={(e) => setConstraintType(e.target.value as typeof CONSTRAINT_TYPES[keyof typeof CONSTRAINT_TYPES])}
          className="px-3 py-2 rounded border border-gray-300 bg-white dark:border-white/20 dark:bg-black/30 text-inherit text-sm sm:text-base"
        >
          <option value={CONSTRAINT_TYPES.NOT_TOGETHER}>{t('constraints.types.notTogether')}</option>
          <option value={CONSTRAINT_TYPES.TOGETHER}>{t('constraints.types.together')}</option>
          <option value={CONSTRAINT_TYPES.MUST_BE_IN_ROW}>{t('constraints.types.mustBeInRow')}</option>
          <option value={CONSTRAINT_TYPES.FAR_APART}>{t('constraints.types.farApart')}</option>
          <option value={CONSTRAINT_TYPES.ABSOLUTE}>{t('constraints.types.absolute')}</option>
        </select>

        {constraintType === CONSTRAINT_TYPES.ABSOLUTE ? (
          <AbsoluteConstraintForm />
        ) : constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW ? (
          <RowConstraintForm />
        ) : constraintType === CONSTRAINT_TYPES.FAR_APART ? (
          <FarApartConstraintForm />
        ) : (
          <PairConstraintForm />
        )}
      </div>

      <div className="flex flex-col gap-2 min-h-[50px]">
        {constraints.map((constraint, index) => (
          <div key={index} className="flex justify-between items-center gap-2 bg-white/5 px-2 sm:px-3 py-2 sm:py-3 rounded border border-white/10 text-sm sm:text-base">
            <span className="break-words">{getConstraintDescription(constraint, t)}</span>
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
