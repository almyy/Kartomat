interface ClassroomConfigProps {
  rows: number
  cols: number
  onRowsChange: (rows: number) => void
  onColsChange: (cols: number) => void
}

export function ClassroomConfig({
  rows,
  cols,
  onRowsChange,
  onColsChange,
}: ClassroomConfigProps) {
  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h2 className="mt-0 mb-4 text-xl">Classroom Size</h2>
      <div className="flex gap-4 mb-2">
        <label className="flex flex-col gap-2 flex-1">
          Rows:
          <input
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={(e) => onRowsChange(parseInt(e.target.value) || 1)}
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
            onChange={(e) => onColsChange(parseInt(e.target.value) || 1)}
            className="px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
          />
        </label>
      </div>
      <p className="text-gray-400 text-sm m-0">Total seats: {rows * cols}</p>
    </div>
  )
}
