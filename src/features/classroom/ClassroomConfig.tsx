import { useTranslation } from 'react-i18next'
import { Accordion, Button, NumberInput, Title, Text } from '@mantine/core'
import { useStore } from '../../store'
import { SeatState } from '../../store/classroomSlice'
import { useThrottle } from '../../hooks/useThrottle'

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
    <Accordion.Item value="classroom">
      <Accordion.Control>
        <Title order={2} size="h3">{t('classroom.title')}</Title>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4 mt-3 sm:mt-4">
          <NumberInput
            label={`${t('classroom.rows')}:`}
            min={1}
            max={10}
            value={rows}
            onChange={(value) => setRows(typeof value === 'number' ? value : 1)}
            className="flex-1"
          />
          <NumberInput
            label={`${t('classroom.columns')}:`}
            min={1}
            max={10}
            value={cols}
            onChange={(value) => setCols(typeof value === 'number' ? value : 1)}
            className="flex-1"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center mb-2">
            <Text size="sm" c="dimmed">{t('classroom.genderInstruction')}</Text>
            <Button
              onClick={alternateGenders}
              size="xs"
              color="grape"
            >
              {t('classroom.alternateButton')}
            </Button>
          </div>
          <div 
            className="grid gap-2 sm:gap-3 w-full mx-auto"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
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
          </div>
        </div>

        <Text size="sm" c="dimmed">{t('classroom.availableSeats', { count: availableSeats })}</Text>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
