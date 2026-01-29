import { useStore } from '../../store'

export function ClassroomConfig() {
  const rows = useStore((state) => state.rows)
  const cols = useStore((state) => state.cols)
  const layout = useStore((state) => state.layout)
  const setRows = useStore((state) => state.setRows)
  const setCols = useStore((state) => state.setCols)
  const toggleSeat = useStore((state) => state.toggleSeat)

  const availableSeats = layout.flat().filter(seat => seat).length

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h2 className="mt-0 mb-4 text-xl">Classroom Layout</h2>
      <div className="flex gap-4 mb-4">
        <label className="flex flex-col gap-2 flex-1">
          Rows:
          <input
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
          />
        </label>
        <label className="flex flex-col gap-2 flex-1">
          Columns:
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
          />
        </label>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Click seats to toggle available/empty spaces:</p>
        <div className="flex flex-col gap-1">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((isAvailable, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                  className={`w-10 h-10 rounded text-xs font-medium border transition-all ${
                    isAvailable
                      ? 'bg-indigo-600/30 border-indigo-600/50 hover:bg-indigo-600/50'
                      : 'bg-gray-700/30 border-gray-700/50 hover:bg-gray-700/50'
                  }`}
                  title={isAvailable ? 'Available seat' : 'Empty space'}
                >
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-gray-400 text-sm m-0">Available seats: {availableSeats}</p>
    </div>
  )
}
