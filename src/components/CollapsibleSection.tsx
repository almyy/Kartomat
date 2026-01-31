import { ReactNode, useState } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultCollapsed?: boolean
  id?: string
  className?: string
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultCollapsed = false,
  id,
  className = ''
}: CollapsibleSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const headingId = id ? `${id}-heading` : undefined

  return (
    <section 
      className={`bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700 rounded-lg border print:!border-none print:!bg-transparent print:!rounded-none ${className}`}
      aria-labelledby={headingId}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center p-4 sm:p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left print:hidden"
        aria-expanded={!isCollapsed}
        aria-controls={id}
      >
        <h2 id={headingId} className="mt-0 mb-0 text-lg sm:text-xl">
          {title}
        </h2>
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform flex-shrink-0 ml-2 ${
            isCollapsed ? '-rotate-90' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <div
        id={id}
        className={`overflow-hidden transition-all duration-300 print:!max-h-full print:!overflow-visible ${
          isCollapsed ? 'max-h-0' : 'max-h-[2000px]'
        }`}
      >
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 print:!p-0">
          {children}
        </div>
      </div>
    </section>
  )
}
