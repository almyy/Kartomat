import { useTranslation } from 'react-i18next'
import { Button, Select, NumberInput } from '@mantine/core'
import { useStore } from '../../store'
import { useRowConstraintForm } from './useRowConstraintForm'

export function RowConstraintForm() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const rows = useStore((state) => state.rows)
  const rowStudent = useStore((state) => state.rowStudent)
  const rowNumber = useStore((state) => state.rowNumber)
  const setRowStudent = useStore((state) => state.setRowStudent)
  const setRowNumber = useStore((state) => state.setRowNumber)
  const { handleAddConstraint } = useRowConstraintForm()

  return (
    <>
      <Select
        label={t('constraints.selectStudent')}
        value={rowStudent}
        onChange={(value) => setRowStudent(value || '')}
        data={[
          { value: '', label: t('constraints.selectStudent') },
          ...students.map(s => ({ value: s.name, label: s.name }))
        ]}
        allowDeselect={false}
      />
      <NumberInput
        label={t('constraints.rowNumber')}
        min={0}
        max={rows - 1}
        value={rowNumber}
        onChange={(value) => setRowNumber(typeof value === 'number' ? value : 0)}
        placeholder={t('constraints.rowNumber')}
      />
      <Button
        onClick={handleAddConstraint}
      >
        {t('constraints.addButton')}
      </Button>
    </>
  )
}
