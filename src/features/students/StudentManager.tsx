import { KeyboardEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { CollapsibleSection, Button } from '../../components'
import { Gender } from '../../types/student'
import { useThrottle } from '../../hooks/useThrottle'
import { HStack, Input, Text, Flex, Box } from '@chakra-ui/react'

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
    <CollapsibleSection title={t('students.title')} id="students">
      <HStack gap={2} mb={4} mt={4} flexDirection={{ base: 'column', sm: 'row' }}>
        <Input
          value={studentInput}
          onChange={(e) => setStudentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('students.placeholder')}
          flex={1}
        />
        <Button
          onClick={handleAddStudent}
          variant="primary"
        >
          {t('students.addButton')}
        </Button>
      </HStack>
      
      <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.400" mb={2}>
        {t('students.genderInstruction')}
      </Text>
      
      <Flex flexWrap="wrap" gap={2} minH="50px">
        {students.map(student => {
          const genderButton = getGenderButton(student.gender)
          return (
            <Box
              key={student.name}
              display="flex"
              alignItems="center"
              borderRadius="full"
              border="1px solid"
              fontSize={{ base: 'sm', sm: 'base' }}
              transition="colors 0.2s"
              className={genderButton.pillClassName}
            >
              <Box
                as="button"
                onClick={() => throttledCycleGender(student.name)}
                display="flex"
                alignItems="center"
                gap={2}
                flex={1}
                cursor="pointer"
                outline="none"
                px={3}
                py={2}
                borderLeftRadius="full"
                aria-label={`${student.name}: ${genderButton.label}. ${t('students.tapToChange')}`}
              >
                <span>{student.name}</span>
                <Box
                  as="span"
                  w={6}
                  h={6}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={genderButton.iconClassName}
                  border="0"
                  fontSize="base"
                  fontWeight="bold"
                  transition="colors 0.2s"
                  flexShrink={0}
                  title={genderButton.label}
                >
                  {genderButton.icon}
                </Box>
              </Box>
              <Box
                as="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeStudent(student.name)
                }}
                aria-label={t('students.removeLabel', { name: student.name })}
                w={6}
                h={6}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="red.500"
                opacity={0.7}
                _hover={{ opacity: 0.9 }}
                _active={{ bg: 'red.600' }}
                border="0"
                fontSize="lg"
                lineHeight="none"
                flexShrink={0}
                mr={2}
                cursor="pointer"
              >
                ×
              </Box>
            </Box>
          )
        })}
      </Flex>
    </CollapsibleSection>
  )
}
