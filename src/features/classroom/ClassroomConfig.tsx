import { useTranslation } from 'react-i18next'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'
import { SeatGenderRestriction } from '../../store/classroomSlice'

export function ClassroomConfig() {
  const { t } = useTranslation()
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const layout = useStore((state) => state.layout)
  const seatGenders = useStore((state) => state.seatGenders)
  const setRows = useStore((state) => state.setRows)
  const setCols = useStore((state) => state.setCols)
  const toggleSeat = useStore((state) => state.toggleSeat)
  const cycleSeatGender = useStore((state) => state.cycleSeatGender)

  const availableSeats = layout.flat().filter(seat => seat).length

  const getSeatStyle = (isAvailable: boolean, gender: SeatGenderRestriction) => {
    if (!isAvailable) {
      return 'bg-gray-700/30 border-gray-700/50 hover:bg-gray-700/50'
    }
    
    if (gender === 'male') {
      return 'bg-blue-600/30 border-blue-600/50 hover:bg-blue-600/40'
    } else if (gender === 'female') {
      return 'bg-pink-600/30 border-pink-600/50 hover:bg-pink-600/40'
    } else {
      return 'bg-gray-600/30 border-gray-600/50 hover:bg-gray-600/40'
    }
  }

  const getSeatIcon = (gender: SeatGenderRestriction) => {
    if (gender === 'male') return '♂'
    if (gender === 'female') return '♀'
    return '○'
  }

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
        <p className="text-xs sm:text-sm text-gray-400 mb-2">{t('classroom.genderInstruction')}</p>
        <div className="flex flex-col gap-1 overflow-x-auto">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((isAvailable, colIndex) => {
                const gender = seatGenders[rowIndex][colIndex]
                return (
                  <div key={colIndex} className="relative group">
                    <button
                      onClick={() => cycleSeatGender(rowIndex, colIndex)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        toggleSeat(rowIndex, colIndex)
                      }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded text-base sm:text-lg font-bold border transition-all flex-shrink-0 ${getSeatStyle(isAvailable, gender)}`}
                      title={isAvailable ? `${t('classroom.availableSeat')} - ${gender === 'any' ? t('classroom.anyGender') : gender === 'male' ? t('students.genderMale') : t('students.genderFemale')}` : t('classroom.emptySpace')}
                    >
                      {isAvailable && getSeatIcon(gender)}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-400 text-xs sm:text-sm m-0">{t('classroom.availableSeats', { count: availableSeats })}</p>
    </CollapsibleSection>
  )
}
