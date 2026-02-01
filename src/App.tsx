import { useTranslation } from 'react-i18next'
import { solveSeatingCSP } from './cspSolver'
import { StudentManager } from './features/students'
import { ClassroomConfig } from './features/classroom'
import { ConstraintManager } from './features/constraints'
import { SeatingDisplay } from './features/seating'
import { SolveButton } from './features/solver'
import { LanguageSelector } from './components/LanguageSelector'
import { UndoRedoButtons } from './components/UndoRedoButtons'
import { useStore } from './store'
import { Container, Box, Heading, Text, Flex, VStack } from '@chakra-ui/react'

function App() {
  const { t } = useTranslation()
  const students = useStore((state) => state.students)
  const constraints = useStore((state) => state.constraints)
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const seatState = useStore((state) => state.seatState)
  const setSeatingResult = useStore((state) => state.setSeatingResult)

  const solve = () => {
    // Convert seatState to Seat objects for solver
    const seatLayout = seatState.map(row => row.map(state => ({
      available: state !== 'off',
      gender: state === 'm' ? 'male' as const : state === 'f' ? 'female' as const : 'any' as const
    })))
    
    const result = solveSeatingCSP(students, constraints, rows, cols, seatLayout)
    setSeatingResult(result)
  }

  return (
    <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 4, sm: 6, lg: 8 }}>
      <Box position="relative" mb={{ base: 4, sm: 2 }} className="print:hidden">
        <Box position="absolute" top={0} right={0}>
          <LanguageSelector />
        </Box>
        <Box width="full">
          <Heading as="h1" textAlign="center" mb={{ base: 1, sm: 2 }}>{t('app.title')}</Heading>
          <Text textAlign="center" color="gray.400" fontSize={{ base: 'sm', sm: 'base' }} mb={{ base: 4, sm: 8 }}>{t('app.subtitle')}</Text>
        </Box>
      </Box>
      
      <Flex flexWrap="wrap" justifyContent="center" gap={{ base: 4, sm: 6, lg: 8 }}>
        <VStack gap={{ base: 4, sm: 5, lg: 6 }} width="full" maxW="2xl" className="print:hidden">
          <StudentManager />
          <ClassroomConfig />
          <ConstraintManager />
          <SolveButton onSolve={solve} disabled={students.length === 0} />
        </VStack>

        <Box width="full" maxW="2xl">
          <SeatingDisplay />
        </Box>
      </Flex>

      <UndoRedoButtons />
    </Container>
  )
}

export default App
