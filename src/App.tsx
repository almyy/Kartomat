import { useTranslation } from "react-i18next";
import { Accordion, Title, Text } from "@mantine/core";
import { solveSeatingCSP } from "./cspSolver";
import { StudentManager } from "./features/students";
import { ClassroomConfig } from "./features/classroom";
import { ConstraintManager } from "./features/constraints";
import { SeatingDisplay } from "./features/seating";
import { SolveButton } from "./features/solver";
import { UndoRedoButtons } from "./components";
import { useStore } from "./store";
import { LanguagePicker, ThemeSwitcher, SettingsMenu } from "./components";

function App() {
  const { t } = useTranslation();
  const students = useStore((state) => state.students);
  const constraints = useStore((state) => state.constraints);
  const rows = useStore((state) => state.rows);
  const cols = useStore((state) => state.cols);
  const seatState = useStore((state) => state.seatState);
  const setSeatingResult = useStore((state) => state.setSeatingResult);

  const solve = () => {
    // Convert seatState to Seat objects for solver
    const seatLayout = seatState.map((row) =>
      row.map((state) => ({
        available: state !== "off",
        gender:
          state === "m"
            ? ("male" as const)
            : state === "f"
              ? ("female" as const)
              : ("any" as const),
      })),
    );

    const result = solveSeatingCSP(
      students,
      constraints,
      rows,
      cols,
      seatLayout,
    );
    setSeatingResult(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="relative mb-4 sm:mb-2 print:hidden">
        {/* Settings menu for small screens */}
        <div className="flex sm:hidden absolute top-0 right-0">
          <SettingsMenu />
        </div>
        {/* Individual buttons for larger screens */}
        <div className="hidden sm:flex flex-row gap-4 sm:gap-5 lg:gap-6 absolute top-0 right-0">
          <LanguagePicker />
          <ThemeSwitcher />
        </div>
        <div className="w-full">
          <Title order={1} ta="center" mb="xs">
            {t("app.title")}
          </Title>
          <Text ta="center" c="dimmed" size="sm" mb="xl">
            {t("app.subtitle")}
          </Text>
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full print:hidden">
          <Accordion
            variant="separated"
            multiple
            defaultValue={["students", "classroom", "constraints"]}
          >
            <StudentManager />
            <ClassroomConfig />
            <ConstraintManager />
          </Accordion>
          <SolveButton onSolve={solve} disabled={students.length === 0} />
        </div>
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full">
          <SeatingDisplay />
        </div>
      </div>

      <UndoRedoButtons />
    </div>
  );
}

export default App;
