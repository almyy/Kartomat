import { KeyboardEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'

export function StudentManager() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const addStudent = useStore((state) => state.addStudent)
  const removeStudent = useStore((state) => state.removeStudent)
  
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
      <div className="flex flex-wrap gap-2 min-h-[50px]">
        {students.map(name => (
          <div key={name} className="flex items-center gap-2 bg-indigo-600/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-indigo-600/50 text-sm sm:text-base">
            {name}
            <button
              onClick={() => removeStudent(name)}
              aria-label={t('students.removeLabel', { name })}
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
