import { ReactNode } from 'react'
import { Accordion, Heading } from '@chakra-ui/react'

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
  const defaultValue = defaultCollapsed ? [] : [id || 'item']

  return (
    <Accordion.Root 
      collapsible 
      defaultValue={defaultValue}
      variant="outline"
      className={className}
    >
      <Accordion.Item value={id || 'item'}>
        <Accordion.ItemTrigger>
          <Heading as="h2" size="lg" flex={1}>
            {title}
          </Heading>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            {children}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
