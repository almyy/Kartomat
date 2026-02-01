import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { useRowConstraintForm } from './useRowConstraintForm'
import { Button } from '../../components'
import { NativeSelect, Input } from '@chakra-ui/react'

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
      <NativeSelect.Root>
        <NativeSelect.Field
          id="row-student"
          value={rowStudent}
          onChange={(e) => setRowStudent(e.target.value)}
        >
          <option value="">{t('constraints.selectStudent')}</option>
          {students.map(s => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Input
        type="number"
        min={0}
        max={rows - 1}
        value={rowNumber}
        onChange={handleRowNumberChange}
        placeholder={t('constraints.rowNumber')}
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
