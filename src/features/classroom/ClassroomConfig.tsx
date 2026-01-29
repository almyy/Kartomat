import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'

export function ClassroomConfig() {
  const { t } = useTranslation()
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const layout = useStore((state) => state.layout)
  const setRows = useStore((state) => state.setRows)
  const setCols = useStore((state) => state.setCols)
  const toggleSeat = useStore((state) => state.toggleSeat)

  const availableSeats = layout.flat().filter(seat => seat).length

  return (
    <CollapsibleSection title={t('classroom.title')} id="classroom">
      <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4 mt-3 sm:mt-4">
        <label className="flex flex-col gap-2 flex-1">
          <span className="text-sm sm:text-base">{t('classroom.rows')}:</span>
          <input
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
          />
        </label>
        <label className="flex flex-col gap-2 flex-1">
          <span className="text-sm sm:text-base">{t('classroom.columns')}:</span>
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            className="px-3 py-2 rounded border border-white/20 bg-black/30 text-inherit text-sm sm:text-base"
          />
        </label>
      </div>

      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-400 mb-2">{t('classroom.toggleInstruction')}</p>
        <div className="flex flex-col gap-1 overflow-x-auto">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((isAvailable, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded text-xs font-medium border transition-all flex-shrink-0 ${
                    isAvailable
                      ? 'bg-indigo-600/30 border-indigo-600/50 hover:bg-indigo-600/50'
                      : 'bg-gray-700/30 border-gray-700/50 hover:bg-gray-700/50'
                  }`}
                  title={isAvailable ? t('classroom.availableSeat') : t('classroom.emptySpace')}
                >
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-400 text-xs sm:text-sm m-0">{t('classroom.availableSeats', { count: availableSeats })}</p>
    </CollapsibleSection>
  )
}
