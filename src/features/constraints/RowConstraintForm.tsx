import { useTranslation } from 'react-i18next'
import { Button } from '@mantine/core'
import { useStore } from '../../store'
import { useRowConstraintForm } from './useRowConstraintForm'

export function RowConstraintForm() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const rows = useStore((state) => state.rows)
  const rowStudent = useStore((state) => state.rowStudent)
  const rowNumber = useStore((state) => state.rowNumber)
  const setRowStudent = useStore((state) => state.setRowStudent)
  const { handleAddConstraint, handleRowNumberChange } = useRowConstraintForm()

  return (
    <>
      <label htmlFor="row-student" className="sr-only">{t('constraints.selectStudent')}</label>
      <select
        id="row-student"
        value={rowStudent}
        onChange={(e) => setRowStudent(e.target.value)}
        className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
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
        value={rowNumber}
        onChange={handleRowNumberChange}
        placeholder={t('constraints.rowNumber')}
        className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
      />
      <Button
        onClick={handleAddConstraint}
      >
        {t('constraints.addButton')}
      </Button>
    </>
  )
}
