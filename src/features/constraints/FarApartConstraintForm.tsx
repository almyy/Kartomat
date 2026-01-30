import { useTranslation } from 'react-i18next'
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
  const { handleAddConstraint, handleMinDistanceChange } = useFarApartConstraintForm()

  return (
    <>
      <label htmlFor="far-apart-student1" className="sr-only">{t('constraints.selectStudent1')}</label>
      <select
        id="far-apart-student1"
        value={farApartStudent1}
        onChange={(e) => setFarApartStudent1(e.target.value)}
        className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
      >
        <option value="">{t('constraints.selectStudent1')}</option>
        {students.map(s => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>
      <label htmlFor="far-apart-student2" className="sr-only">{t('constraints.selectStudent2')}</label>
      <select
        id="far-apart-student2"
        value={farApartStudent2}
        onChange={(e) => setFarApartStudent2(e.target.value)}
        className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
      >
        <option value="">{t('constraints.selectStudent2')}</option>
        {students.filter(s => s.name !== farApartStudent1).map(s => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        step="0.5"
        value={farApartMinDistance}
        onChange={handleMinDistanceChange}
        placeholder={t('constraints.distanceUnits')}
        className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
      />
      <button
        onClick={handleAddConstraint}
        className="px-4 py-2 rounded border border-white/20 bg-indigo-600/70 text-white cursor-pointer hover:bg-indigo-600/90 transition-colors text-sm sm:text-base"
      >
        {t('constraints.addButton')}
      </button>
    </>
  )
}
