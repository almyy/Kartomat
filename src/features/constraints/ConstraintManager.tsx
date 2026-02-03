import { useTranslation } from "react-i18next";
import {
  Accordion,
  Select,
  Title,
  Text,
  Button,
  ActionIcon,
} from "@mantine/core";
import { CONSTRAINT_TYPES } from "../../cspSolver";
import { useStore } from "../../store";
import { getConstraintDescription } from "./constraintUtils";
import { PairConstraintForm } from "./PairConstraintForm";
import { RowConstraintForm } from "./RowConstraintForm";
import { FarApartConstraintForm } from "./FarApartConstraintForm";
import { AbsoluteConstraintForm } from "./AbsoluteConstraintForm";
import { IconX } from "@tabler/icons-react";

export function ConstraintManager() {
  const { t } = useTranslation();
  const constraints = useStore((state) => state.constraints);
  const removeConstraint = useStore((state) => state.removeConstraint);
  const constraintType = useStore((state) => state.constraintType);
  const setConstraintType = useStore((state) => state.setConstraintType);

  return (
    <Accordion.Item value="constraints">
      <Accordion.Control>
        <Title order={2} size="h3">
          {t("constraints.title")}
        </Title>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="flex flex-col gap-2 mb-3 sm:mb-4 mt-3 sm:mt-4">
          <Select
            label={t("constraints.typeLabel")}
            value={constraintType}
            onChange={(value) =>
              setConstraintType(
                value as (typeof CONSTRAINT_TYPES)[keyof typeof CONSTRAINT_TYPES],
              )
            }
            data={[
              {
                value: CONSTRAINT_TYPES.NOT_TOGETHER,
                label: t("constraints.types.notTogether"),
              },
              {
                value: CONSTRAINT_TYPES.TOGETHER,
                label: t("constraints.types.together"),
              },
              {
                value: CONSTRAINT_TYPES.MUST_BE_IN_ROW,
                label: t("constraints.types.mustBeInRow"),
              },
              {
                value: CONSTRAINT_TYPES.FAR_APART,
                label: t("constraints.types.farApart"),
              },
              {
                value: CONSTRAINT_TYPES.ABSOLUTE,
                label: t("constraints.types.absolute"),
              },
            ]}
            allowDeselect={false}
          />

          {constraintType === CONSTRAINT_TYPES.ABSOLUTE ? (
            <AbsoluteConstraintForm />
          ) : constraintType === CONSTRAINT_TYPES.MUST_BE_IN_ROW ? (
            <RowConstraintForm />
          ) : constraintType === CONSTRAINT_TYPES.FAR_APART ? (
            <FarApartConstraintForm />
          ) : (
            <PairConstraintForm />
          )}
        </div>

        <div className="flex flex-col gap-2 min-h-[50px]">
          {constraints.map((constraint, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-2 bg-white/5 px-2 sm:px-3 py-2 sm:py-3 rounded border border-white/10"
            >
              <Text size="sm">{getConstraintDescription(constraint, t)}</Text>
              <ActionIcon
                aria-label={t("constraints.removeLabel")}
                onClick={() => removeConstraint(index)}
                color="red"
              >
                <IconX />
              </ActionIcon>
            </div>
          ))}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
