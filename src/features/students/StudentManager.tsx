import { KeyboardEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { CollapsibleSection, Button } from '../../components'
import { Gender } from '../../types/student'
import { useThrottle } from '../../hooks/useThrottle'

export function StudentManager() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const addStudent = useStore((state) => state.addStudent)
  const removeStudent = useStore((state) => state.removeStudent)
  const cycleStudentGender = useStore((state) => state.cycleStudentGender)
  
  // Local state for temporary input
  const [studentInput, setStudentInput] = useState('')
  
  // Throttle the cycle function to prevent rapid clicks
  const throttledCycleGender = useThrottle(cycleStudentGender, 100)

  const handleAddStudent = () => {
    addStudent(studentInput)
    setStudentInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddStudent()
    }
  }

  const getGenderButton = (gender?: Gender) => {
    if (!gender) {
      return {
        icon: '○',
        pillClassName: 'bg-gray-600/30 border-gray-600/50 hover:bg-gray-600/40',
        iconClassName: 'bg-gray-500/70',
        label: t('students.genderNone')
      }
    } else if (gender === 'male') {
      return {
        icon: '♂',
        pillClassName: 'bg-blue-600/30 border-blue-600/50 hover:bg-blue-600/40',
        iconClassName: 'bg-blue-500/70',
        label: t('students.genderMale')
      }
    } else {
      return {
        icon: '♀',
        pillClassName: 'bg-pink-600/30 border-pink-600/50 hover:bg-pink-600/40',
        iconClassName: 'bg-pink-500/70',
        label: t('students.genderFemale')
      }
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
          className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white dark:border-white/20 dark:bg-black/30 text-inherit text-sm sm:text-base"
        />
        <Button
          onClick={handleAddStudent}
          variant="primary"
          className="whitespace-nowrap"
        >
          {t('students.addButton')}
        </Button>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-400 mb-2">
        {t('students.genderInstruction')}
      </p>
      
      <div className="flex flex-wrap gap-2 min-h-[50px]">
        {students.map(student => {
          const genderButton = getGenderButton(student.gender)
          return (
            <div 
              key={student.name} 
              className={`flex items-center rounded-full border text-sm sm:text-base transition-colors ${genderButton.pillClassName}`}
            >
              <button
                onClick={() => throttledCycleGender(student.name)}
                className={`flex items-center gap-2 flex-1 cursor-pointer outline-none px-3 py-2 rounded-l-full`}
                aria-label={`${student.name}: ${genderButton.label}. ${t('students.tapToChange')}`}
              >
                <span>{student.name}</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${genderButton.iconClassName} border-0 text-base font-bold transition-colors flex-shrink-0`}
                  title={genderButton.label}
                >
                  {genderButton.icon}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeStudent(student.name)
                }}
                aria-label={t('students.removeLabel', { name: student.name })}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/70 hover:bg-red-500/90 active:bg-red-600 border-0 text-lg leading-none flex-shrink-0 mr-2"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}
