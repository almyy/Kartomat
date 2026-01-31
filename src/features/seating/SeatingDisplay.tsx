import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { PrintButton } from './PrintButton'
import { CollapsibleSection } from '../../components/CollapsibleSection'

export function SeatingDisplay() {
  const { t } = useTranslation()
  const seatingResult = useStore((state) => state.seatingResult)
  const seatState = useStore((state) => state.seatState)

  const handlePrint = () => {
    window.print()
  }

  return (
    <CollapsibleSection 
      title={t('seating.title')} 
      id="seating"
      className="min-h-[300px] sm:min-h-[400px]"
    >
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
                            : 'bg-white/5 border-white/10 border-dashed'
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
            <div className="bg-red-500/20 border border-red-500/50 px-3 sm:px-4 py-3 sm:py-4 rounded text-red-400 text-sm sm:text-base">
              {seatingResult.message}
            </div>
          )}
        </>
      )}
      {!seatingResult && (
        <div className="flex items-center justify-center min-h-[250px] sm:min-h-[300px] text-gray-400 text-center px-4 sm:px-8 text-sm sm:text-base">
          {t('seating.emptyMessage')}
        </div>
      )}
    </CollapsibleSection>
  )
}
