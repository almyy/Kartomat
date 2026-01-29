import { KeyboardEvent } from 'react'

interface StudentManagerProps {
  students: string[]
  studentInput: string
  setStudentInput: (value: string) => void
  onAddStudent: () => void
  onRemoveStudent: (name: string) => void
}

export function StudentManager({
  students,
  studentInput,
  setStudentInput,
  onAddStudent,
  onRemoveStudent,
}: StudentManagerProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddStudent()
    }
  }

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h2 className="mt-0 mb-4 text-xl">Students</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={studentInput}
          onChange={(e) => setStudentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter student name"
          className="flex-1 px-2 py-2 rounded border border-white/20 bg-black/30 text-inherit"
        />
        <button
          onClick={onAddStudent}
          className="px-4 py-2 rounded border border-white/20 bg-indigo-600/70 text-white cursor-pointer hover:bg-indigo-600/90 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[50px]">
        {students.map(name => (
          <div key={name} className="flex items-center gap-2 bg-indigo-600/30 px-3 py-2 rounded-full border border-indigo-600/50">
            {name}
            <button
              onClick={() => onRemoveStudent(name)}
              aria-label={`Remove ${name}`}
              className="w-5 h-5 rounded-full flex items-center justify-center bg-red-500/70 hover:bg-red-500/90 border-0 text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
