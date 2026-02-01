import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { usePairConstraintForm } from './usePairConstraintForm'
import { Button } from '../../components'
import { NativeSelect } from '@chakra-ui/react'

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
      <label htmlFor="pair-student1" className="sr-only">{t('constraints.selectStudent1')}</label>
      <NativeSelect.Root>
        <NativeSelect.Field
          id="pair-student1"
          value={pairStudent1}
          onChange={(e) => setPairStudent1(e.target.value)}
        >
          <option value="">{t('constraints.selectStudent1')}</option>
          {students.map(s => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <label htmlFor="pair-student2" className="sr-only">{t('constraints.selectStudent2')}</label>
      <NativeSelect.Root>
        <NativeSelect.Field
          id="pair-student2"
          value={pairStudent2}
          onChange={(e) => setPairStudent2(e.target.value)}
        >
          <option value="">{t('constraints.selectStudent2')}</option>
          {students.filter(s => s.name !== pairStudent1).map(s => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Button
        onClick={handleAddConstraint}
        variant="primary"
      >
        {t('constraints.addButton')}
      </Button>
    </>
  )
}
