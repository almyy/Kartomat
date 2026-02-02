import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { useAbsoluteConstraintForm } from './useAbsoluteConstraintForm'
import { Button } from '../../components'

export function AbsoluteConstraintForm() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const absoluteStudent = useStore((state) => state.absoluteStudent)
  const absoluteRow = useStore((state) => state.absoluteRow)
  const absoluteCol = useStore((state) => state.absoluteCol)
  const setAbsoluteStudent = useStore((state) => state.setAbsoluteStudent)
  const { handleAddConstraint, handleRowChange, handleColChange } = useAbsoluteConstraintForm()

  return (
    <>
      <label htmlFor="absolute-student" className="sr-only">{t('constraints.selectStudent')}</label>
      <select
        id="absolute-student"
        value={absoluteStudent}
        onChange={(e) => setAbsoluteStudent(e.target.value)}
        className="px-3 py-2 rounded border text-inherit border-gray-300 bg-white/90 dark:border-white/20 dark:bg-black/30 text-sm sm:text-base"
      >
        <option value="">{t('constraints.selectStudent')}</option>
        {students.map(s => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        max={rows - 1}
        value={absoluteRow}
        onChange={handleRowChange}
        placeholder={t('constraints.rowNumber')}
        className="px-3 py-2 rounded border text-inherit border-gray-300 bg-white/90 dark:border-white/20 dark:bg-black/30 text-sm sm:text-base"
      />
      <input
        type="number"
        min="0"
        max={cols - 1}
        value={absoluteCol}
        onChange={handleColChange}
        placeholder={t('constraints.columnNumber')}
        className="px-3 py-2 rounded border text-inherit border-gray-300 bg-white/90 dark:border-white/20 dark:bg-black/30 text-sm sm:text-base"
      />
      <Button
        onClick={handleAddConstraint}
        variant="primary"
      >
        {t('constraints.addButton')}
      </Button>
    </>
  )
}
