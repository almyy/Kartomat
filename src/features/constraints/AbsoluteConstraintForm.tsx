import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { useAbsoluteConstraintForm } from './useAbsoluteConstraintForm'
import { Button } from '../../components'
import { NativeSelect, Input } from '@chakra-ui/react'

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
      <NativeSelect.Root>
        <NativeSelect.Field
          id="absolute-student"
          value={absoluteStudent}
          onChange={(e) => setAbsoluteStudent(e.target.value)}
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
        value={absoluteRow}
        onChange={handleRowChange}
        placeholder={t('constraints.rowNumber')}
      />
      <Input
        type="number"
        min={0}
        max={cols - 1}
        value={absoluteCol}
        onChange={handleColChange}
        placeholder={t('constraints.columnNumber')}
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
