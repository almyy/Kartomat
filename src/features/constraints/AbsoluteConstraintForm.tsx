import { useTranslation } from "react-i18next";
import { Button, Select, NumberInput } from "@mantine/core";
import { useStore } from "../../store";
import { useAbsoluteConstraintForm } from "./useAbsoluteConstraintForm";

export function AbsoluteConstraintForm() {
  const { t } = useTranslation();
  const students = useStore((state) => state.students);
  const rows = useStore((state) => state.rows);
  const cols = useStore((state) => state.cols);
  const absoluteStudent = useStore((state) => state.absoluteStudent);
  const absoluteRow = useStore((state) => state.absoluteRow);
  const absoluteCol = useStore((state) => state.absoluteCol);
  const setAbsoluteStudent = useStore((state) => state.setAbsoluteStudent);
  const setAbsoluteRow = useStore((state) => state.setAbsoluteRow);
  const setAbsoluteCol = useStore((state) => state.setAbsoluteCol);
  const { handleAddConstraint } = useAbsoluteConstraintForm();

  return (
    <>
      <Select
        label={t("constraints.selectStudent")}
        value={absoluteStudent}
        onChange={(value) => setAbsoluteStudent(value || "")}
        data={[
          { value: "", label: t("constraints.selectStudent") },
          ...students.map((s) => ({ value: s.name, label: s.name })),
        ]}
        allowDeselect={false}
      />
      <NumberInput
        label={t("constraints.rowNumber")}
        min={0}
        max={rows - 1}
        value={absoluteRow}
        onChange={(value) =>
          setAbsoluteRow(typeof value === "number" ? value : 0)
        }
        placeholder={t("constraints.rowNumber")}
      />
      <NumberInput
        label={t("constraints.columnNumber")}
        min={0}
        max={cols - 1}
        value={absoluteCol}
        onChange={(value) =>
          setAbsoluteCol(typeof value === "number" ? value : 0)
        }
        placeholder={t("constraints.columnNumber")}
      />
      <Button onClick={handleAddConstraint} className="self-end">
        {t("constraints.addButton")}
      </Button>
    </>
  );
}
