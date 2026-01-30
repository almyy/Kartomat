import { KeyboardEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'
import { Gender } from '../../types/student'

export function StudentManager() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const addStudent = useStore((state) => state.addStudent)
  const removeStudent = useStore((state) => state.removeStudent)
  const updateStudentGender = useStore((state) => state.updateStudentGender)
  
  // Local state for temporary input
  const [studentInput, setStudentInput] = useState('')

  const handleAddStudent = () => {
    addStudent(studentInput)
    setStudentInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddStudent()
    }
  }

  const handleGenderChange = (name: string, gender: string) => {
    if (gender === 'none') {
      updateStudentGender(name, undefined)
    } else {
      updateStudentGender(name, gender as Gender)
    }
  }

  return (
    <CollapsibleSection title={t('students.title')} id="students">{' '}
      <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4 mt-3 sm:mt-4">
        <input
          type="text"
          value={studentInput}
          onChange={(e) => setStudentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('students.placeholder')}
          className="flex-1 px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
        />
        <button
          onClick={handleAddStudent}
          className="px-4 py-2 rounded border border-white/20 bg-indigo-600/70 text-white cursor-pointer hover:bg-indigo-600/90 transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          {t('students.addButton')}
        </button>
      </div>
      <div className="flex flex-col gap-2 min-h-[50px]">
        {students.map(student => (
          <div key={student.name} className="flex items-center gap-2 bg-indigo-600/30 px-2 sm:px-3 py-2 rounded border border-indigo-600/50 text-sm sm:text-base">
            <span className="flex-1">{student.name}</span>
            <select
              value={student.gender || 'none'}
              onChange={(e) => handleGenderChange(student.name, e.target.value)}
              className="px-2 py-1 rounded border border-white/20 bg-black/30 text-inherit text-xs sm:text-sm"
              aria-label={t('students.genderLabel', { name: student.name })}
            >
              <option value="none">{t('students.genderNone')}</option>
              <option value="male">{t('students.genderMale')}</option>
              <option value="female">{t('students.genderFemale')}</option>
            </select>
            <button
              onClick={() => removeStudent(student.name)}
              aria-label={t('students.removeLabel', { name: student.name })}
              className="w-5 h-5 rounded-full flex items-center justify-center bg-red-500/70 hover:bg-red-500/90 border-0 text-lg leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
