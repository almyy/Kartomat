import { useTranslation } from 'react-i18next'
import { CONSTRAINT_TYPES } from '../../cspSolver'
import { useStore } from '../../store'
import { CollapsibleSection } from '../../components/CollapsibleSection'
import { getConstraintDescription } from './constraintUtils'
import { PairConstraintForm } from './PairConstraintForm'
import { RowConstraintForm } from './RowConstraintForm'
import { FarApartConstraintForm } from './FarApartConstraintForm'
import { AbsoluteConstraintForm } from './AbsoluteConstraintForm'
import { VStack, HStack, Text, NativeSelect, IconButton } from '@chakra-ui/react'

export function ConstraintManager() {
  const { t } = useTranslation()
  const constraints = useStore((state) => state.constraints)
  const removeConstraint = useStore((state) => state.removeConstraint)
  const constraintType = useStore((state) => state.constraintType)
  const setConstraintType = useStore((state) => state.setConstraintType)

  return (
    <CollapsibleSection title={t('constraints.title')} id="constraints">
      <VStack gap={2} mb={{ base: 3, sm: 4 }} mt={{ base: 3, sm: 4 }} alignItems="stretch">
        <label htmlFor="constraint-type" className="sr-only">{t('constraints.typeLabel')}</label>
        <NativeSelect.Root>
          <NativeSelect.Field
            id="constraint-type"
            value={constraintType}
            onChange={(e) => setConstraintType(e.target.value as typeof CONSTRAINT_TYPES[keyof typeof CONSTRAINT_TYPES])}
          >
            <option value={CONSTRAINT_TYPES.NOT_TOGETHER}>{t('constraints.types.notTogether')}</option>
            <option value={CONSTRAINT_TYPES.TOGETHER}>{t('constraints.types.together')}</option>
            <option value={CONSTRAINT_TYPES.MUST_BE_IN_ROW}>{t('constraints.types.mustBeInRow')}</option>
            <option value={CONSTRAINT_TYPES.FAR_APART}>{t('constraints.types.farApart')}</option>
            <option value={CONSTRAINT_TYPES.ABSOLUTE}>{t('constraints.types.absolute')}</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        {constraintType === CONSTRAINT_TYPES.ABSOLUTE ? (
          <AbsoluteConstraintForm />
        ) : constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW ? (
          <RowConstraintForm />
        ) : constraintType === CONSTRAINT_TYPES.FAR_APART ? (
          <FarApartConstraintForm />
        ) : (
          <PairConstraintForm />
        )}
      </VStack>

      <VStack gap={2} minH="50px" alignItems="stretch">
        {constraints.map((constraint, index) => (
          <HStack 
            key={index} 
            justifyContent="space-between" 
            alignItems="center" 
            gap={2} 
            bg="whiteAlpha.50" 
            px={{ base: 2, sm: 3 }} 
            py={{ base: 2, sm: 3 }} 
            borderRadius="md" 
            borderWidth={1} 
            borderColor="whiteAlpha.100"
            fontSize={{ base: 'sm', sm: 'base' }}
          >
            <Text wordBreak="break-words" flex={1}>{getConstraintDescription(constraint, t)}</Text>
            <IconButton
              onClick={() => removeConstraint(index)}
              aria-label={t('constraints.removeLabel')}
              colorPalette="red"
              variant="solid"
              size="sm"
              flexShrink={0}
            >
              ×
            </IconButton>
          </HStack>
        ))}
      </VStack>
    </CollapsibleSection>
  )
}
