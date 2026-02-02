import { useTranslation } from 'react-i18next'
import { Accordion, Title, Text } from '@mantine/core'
import { useStore } from '../../store'
import { PrintButton } from './PrintButton'

export function SeatingDisplay() {
  const { t } = useTranslation()
  const seatingResult = useStore((state) => state.seatingResult)
  const seatState = useStore((state) => state.seatState)

  const handlePrint = () => {
    window.print()
  }

  return (
    <Accordion variant="separated" defaultValue="seating">
      <Accordion.Item value="seating">
        <Accordion.Control>
          <Title order={2} size="h3">{t('seating.title')}</Title>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="flex justify-end mb-3 sm:mb-4 mt-3 sm:mt-4">
            {seatingResult?.success && seatingResult.seating && (
              <PrintButton onClick={handlePrint} />
            )}
          </div>
          {seatingResult && (
            <>
              {seatingResult.success && seatingResult.seating ? (
                <div className="flex flex-col gap-1.5 sm:gap-2 overflow-x-auto" id="seating-arrangement">
                  {seatingResult.seating.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1.5 sm:gap-2 items-center">
                      {row.map((seat, colIndex) => {
                        const state = seatState[rowIndex]?.[colIndex]
                        const isAvailable = state !== 'off'
                        return (
                          <div
                            key={colIndex}
                            className={`flex-1 min-h-[50px] sm:min-h-[60px] flex items-center justify-center rounded text-xs sm:text-sm font-medium border transition-all px-1 ${
                              !isAvailable
                                ? 'bg-gray-800/50 border-gray-700/30'
                                : seat
                                ? 'bg-indigo-600/30 border-indigo-600/50 hover:bg-indigo-600/50 hover:scale-105'
                                : 'bg-gray-700/20 border-gray-500/40 border-dashed'
                            }`}
                          >
                            {isAvailable ? (seat || '') : ''}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <Text c="red" p="md" className="bg-red-500/20 border border-red-500/50 rounded">
                  {seatingResult.message}
                </Text>
              )}
            </>
          )}
          {!seatingResult && (
            <Text ta="center" c="dimmed" py="xl">
              {t('seating.emptyMessage')}
            </Text>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
