import { useStore } from '../../store'

export function SeatingDisplay() {
  const seatingResult = useStore((state) => state.seatingResult)

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10 min-h-[400px]">
      <h2 className="mt-0 mb-4">Seating Arrangement</h2>
      {seatingResult && (
        <>
          {seatingResult.success && seatingResult.seating ? (
            <div className="flex flex-col gap-2">
              {seatingResult.seating.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 items-center">
                  <div className="text-sm text-gray-400 min-w-[50px]">Row {rowIndex}</div>
                  {row.map((seat, colIndex) => (
                    <div
                      key={colIndex}
                      className={`flex-1 min-h-[60px] flex items-center justify-center rounded text-sm font-medium border transition-all ${
                        seat
                          ? 'bg-indigo-600/30 border-indigo-600/50 hover:bg-indigo-600/50 hover:scale-105'
                          : 'bg-white/5 border-white/10 border-dashed'
                      }`}
                    >
                      {seat || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-red-500/20 border border-red-500/50 px-4 py-4 rounded text-red-400">
              {seatingResult.message}
            </div>
          )}
        </>
      )}
      {!seatingResult && (
        <div className="flex items-center justify-center min-h-[300px] text-gray-400 text-center px-8">
          Add students and constraints, then click "Solve" to see the seating arrangement
        </div>
      )}
    </div>
  )
}
