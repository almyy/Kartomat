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
      return {
        backgroundColor: 'rgba(55, 65, 81, 0.3)',
        borderColor: 'rgba(55, 65, 81, 0.5)',
        _hover: { backgroundColor: 'rgba(55, 65, 81, 0.5)' }
      }
    } else if (state === 'm') {
      return {
        backgroundColor: 'rgba(37, 99, 235, 0.3)',
        borderColor: 'rgba(37, 99, 235, 0.5)',
        _hover: { backgroundColor: 'rgba(37, 99, 235, 0.4)' }
      }
    } else if (state === 'f') {
      return {
        backgroundColor: 'rgba(219, 39, 119, 0.3)',
        borderColor: 'rgba(219, 39, 119, 0.5)',
        _hover: { backgroundColor: 'rgba(219, 39, 119, 0.4)' }
      }
    } else {
      return {
        backgroundColor: 'rgba(75, 85, 99, 0.3)',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        _hover: { backgroundColor: 'rgba(75, 85, 99, 0.4)' }
      }
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
            row.map((state, colIndex) => {
              const seatStyle = getSeatStyle(state)
              return (
                <Box
                  as="button"
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => throttledCycleSeat(rowIndex, colIndex)}
                  aspectRatio={1}
                  borderRadius="md"
                  fontSize={{ base: 'base', sm: 'lg' }}
                  fontWeight="bold"
                  border="1px solid"
                  transition="all 0.2s"
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  title={getSeatTitle(state)}
                  {...seatStyle}
                >
                  {getSeatIcon(state)}
                </Box>
              )
            })
          )}
        </Grid>
      </Box>

      <Text color="gray.400" fontSize={{ base: 'xs', sm: 'sm' }} m={0}>{t('classroom.availableSeats', { count: availableSeats })}</Text>
    </CollapsibleSection>
  )
}
