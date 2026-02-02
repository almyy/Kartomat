import { useTranslation } from 'react-i18next'
import { Button, Select, NumberInput } from '@mantine/core'
import { useStore } from '../../store'
import { useFarApartConstraintForm } from './useFarApartConstraintForm'

export function FarApartConstraintForm() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const farApartStudent1 = useStore((state) => state.farApartStudent1)
  const farApartStudent2 = useStore((state) => state.farApartStudent2)
  const farApartMinDistance = useStore((state) => state.farApartMinDistance)
  const setFarApartStudent1 = useStore((state) => state.setFarApartStudent1)
  const setFarApartStudent2 = useStore((state) => state.setFarApartStudent2)
  const setFarApartMinDistance = useStore((state) => state.setFarApartMinDistance)
  const { handleAddConstraint } = useFarApartConstraintForm()

  return (
    <>
      <Select
        label={t('constraints.selectStudent1')}
        value={farApartStudent1}
        onChange={(value) => setFarApartStudent1(value || '')}
        data={[
          { value: '', label: t('constraints.selectStudent1') },
          ...students.map(s => ({ value: s.name, label: s.name }))
        ]}
        allowDeselect={false}
      />
      <Select
        label={t('constraints.selectStudent2')}
        value={farApartStudent2}
        onChange={(value) => setFarApartStudent2(value || '')}
        data={[
          { value: '', label: t('constraints.selectStudent2') },
          ...students.filter(s => s.name !== farApartStudent1).map(s => ({ value: s.name, label: s.name }))
        ]}
        allowDeselect={false}
      />
      <NumberInput
        label={t('constraints.distanceUnits')}
        min={1}
        step={0.5}
        value={farApartMinDistance}
        onChange={(value) => setFarApartMinDistance(typeof value === 'number' ? value : 3)}
        placeholder={t('constraints.distanceUnits')}
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
