import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'
import { SeatState } from '../../store/classroomSlice'
import { useThrottle } from '../../hooks/useThrottle'
import { HStack, VStack, Text, Input, Button, Box, Grid } from '@chakra-ui/react'

export function ClassroomConfig() {
  const { t } = useTranslation()
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const seatState = useStore((state) => state.seatState)
  const setRows = useStore((state) => state.setRows)
  const setCols = useStore((state) => state.setCols)
  const cycleSeat = useStore((state) => state.cycleSeat)
  const alternateGenders = useStore((state) => state.alternateGenders)
  
  // Throttle the cycle function to prevent rapid clicks
  const throttledCycleSeat = useThrottle((row: number, col: number) => {
    cycleSeat(row, col)
  }, 100)

  const availableSeats = seatState.flat().filter(seat => seat !== 'off').length

  const getSeatStyle = (state: SeatState) => {
    if (state === 'off') {
      return 'bg-gray-700/30 border-gray-700/50 hover:bg-gray-700/50'
    } else if (state === 'm') {
      return 'bg-blue-600/30 border-blue-600/50 hover:bg-blue-600/40'
    } else if (state === 'f') {
      return 'bg-pink-600/30 border-pink-600/50 hover:bg-pink-600/40'
    } else {
      return 'bg-gray-600/30 border-gray-600/50 hover:bg-gray-600/40'
    }
  }

  const getSeatIcon = (state: SeatState) => {
    if (state === 'm') return '♂'
    if (state === 'f') return '♀'
    if (state === 'n') return '○'
    return ''
  }

  const getSeatTitle = (state: SeatState) => {
    if (state === 'off') return t('classroom.emptySpace')
    if (state === 'm') return `${t('classroom.availableSeat')} - ${t('students.genderMale')}`
    if (state === 'f') return `${t('classroom.availableSeat')} - ${t('students.genderFemale')}`
    return `${t('classroom.availableSeat')} - ${t('classroom.anyGender')}`
  }

  return (
    <CollapsibleSection title={t('classroom.title')} id="classroom">
      <HStack gap={{ base: 3, sm: 4 }} mb={{ base: 3, sm: 4 }} mt={{ base: 3, sm: 4 }}>
        <VStack gap={2} flex={1} alignItems="stretch">
          <Text fontSize={{ base: 'sm', sm: 'base' }}>{t('classroom.rows')}:</Text>
          <Input
            type="number"
            min={1}
            max={10}
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
          />
        </VStack>
        <VStack gap={2} flex={1} alignItems="stretch">
          <Text fontSize={{ base: 'sm', sm: 'base' }}>{t('classroom.columns')}:</Text>
          <Input
            type="number"
            min={1}
            max={10}
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
          />
        </VStack>
      </HStack>

      <Box mb={{ base: 3, sm: 4 }}>
        <HStack justifyContent="space-between" alignItems="center" mb={2}>
          <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.400">{t('classroom.genderInstruction')}</Text>
          <Button
            onClick={alternateGenders}
            colorPalette="purple"
            variant="solid"
            size="sm"
          >
            {t('classroom.alternateButton')}
          </Button>
        </HStack>
        <Grid 
          gap={{ base: 2, sm: 3 }}
          templateColumns={`repeat(${cols}, 1fr)`}
          templateRows={`repeat(${rows}, 1fr)`}
          width="full"
          mx="auto"
        >
          {seatState.map((row, rowIndex) => 
            row.map((state, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => throttledCycleSeat(rowIndex, colIndex)}
                className={`aspect-square rounded text-base sm:text-lg font-bold border transition-all ${getSeatStyle(state)}`}
                title={getSeatTitle(state)}
              >
                {getSeatIcon(state)}
              </button>
            ))
          )}
        </Grid>
      </Box>

      <Text color="gray.400" fontSize={{ base: 'xs', sm: 'sm' }} m={0}>{t('classroom.availableSeats', { count: availableSeats })}</Text>
    </CollapsibleSection>
  )
}
