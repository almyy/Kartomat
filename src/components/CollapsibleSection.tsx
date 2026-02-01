import { ReactNode, useMemo } from 'react'
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
  // Use provided id or generate a unique one based on title
  const itemId = useMemo(() => id || `section-${title.toLowerCase().replace(/\s+/g, '-')}`, [id, title])
  const defaultValue = defaultCollapsed ? [] : [itemId]

  return (
    <Accordion.Root 
      collapsible 
      defaultValue={defaultValue}
      variant="outline"
      className={className}
      borderWidth={2}
      borderColor="whiteAlpha.200"
      borderRadius="lg"
      bg="whiteAlpha.50"
    >
      <Accordion.Item value={itemId} borderWidth={0}>
        <Accordion.ItemTrigger
          _hover={{ bg: 'whiteAlpha.100' }}
          transition="background 0.2s"
        >
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
