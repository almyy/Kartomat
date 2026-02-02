import { KeyboardEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Accordion, Button, TextInput, Title, Text, Badge, CloseButton, Group } from '@mantine/core'
import { useStore } from '../../store'
import { Gender } from '../../types/student'
import { useThrottle } from '../../hooks/useThrottle'
import { IconGenderFemale, IconGenderMale, IconGenderAgender } from '@tabler/icons-react'

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

  const getGenderConfig = (gender?: Gender) => {
    if (!gender) {
      return {
        icon: <IconGenderAgender />,
        color: 'gray' as const,
        label: t('students.genderNone')
      }
    } else if (gender === 'male') {
      return {
        icon: <IconGenderMale />,
        color: 'blue' as const,
        label: t('students.genderMale')
      }
    } else {
      return {
        icon: <IconGenderFemale />,
        color: 'pink' as const,
        label: t('students.genderFemale')
      }
    }
  }

  return (
    <Accordion.Item value="students">
      <Accordion.Control>
        <Title order={2} size="h3">{t('students.title')}</Title>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4 mt-3 sm:mt-4">
          <TextInput
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('students.placeholder')}
            className="flex-1"
          />
          <Button
            onClick={handleAddStudent}
            className="whitespace-nowrap"
          >
            {t('students.addButton')}
          </Button>
        </div>
        
        <Text size="sm" c="dimmed" mb="xs">
          {t('students.genderInstruction')}
        </Text>
        
        <Group gap="xs">
          {students.map(student => {
            const genderConfig = getGenderConfig(student.gender)
            return (
              <Badge
                key={student.name}
                color={genderConfig.color}
                size="lg"
                variant="light"
                style={{ cursor: 'pointer', paddingRight: '0.25rem' }}
                onClick={() => throttledCycleGender(student.name)}
                rightSection={
                  <CloseButton
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeStudent(student.name)
                    }}
                    aria-label={t('students.removeLabel', { name: student.name })}
                  />
                }
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {student.name}
                  <span title={genderConfig.label} style={{ fontSize: '1.25rem' }}>
                    {genderConfig.icon}
                  </span>
                </span>
              </Badge>
            )
          })}
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
