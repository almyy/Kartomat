import { useTranslation } from 'react-i18next'
import { Button, Select } from '@mantine/core'
import { useStore } from '../../store'
import { usePairConstraintForm } from './usePairConstraintForm'

export function PairConstraintForm() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const pairStudent1 = useStore((state) => state.pairStudent1)
  const pairStudent2 = useStore((state) => state.pairStudent2)
  const setPairStudent1 = useStore((state) => state.setPairStudent1)
  const setPairStudent2 = useStore((state) => state.setPairStudent2)
  const { handleAddConstraint } = usePairConstraintForm()

  return (
    <>
      <Select
        label={t('constraints.selectStudent1')}
        value={pairStudent1}
        onChange={(value) => setPairStudent1(value || '')}
        data={[
          { value: '', label: t('constraints.selectStudent1') },
          ...students.map(s => ({ value: s.name, label: s.name }))
        ]}
        allowDeselect={false}
      />
      <Select
        label={t('constraints.selectStudent2')}
        value={pairStudent2}
        onChange={(value) => setPairStudent2(value || '')}
        data={[
          { value: '', label: t('constraints.selectStudent2') },
          ...students.filter(s => s.name !== pairStudent1).map(s => ({ value: s.name, label: s.name }))
        ]}
        allowDeselect={false}
      />
      <Button
        onClick={handleAddConstraint}
        className="self-end"
      >
        {t('constraints.addButton')}
      </Button>
    </>
  )
}
