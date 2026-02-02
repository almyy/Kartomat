import { ChangeEvent } from "react";
import { useStore } from "../../store";
import { CONSTRAINT_TYPES, FarApartConstraint } from "../../cspSolver";
import { isValidStudentPair } from "./constraintUtils";

export function useFarApartConstraintForm() {
  const students = useStore((state) => state.students);
  const addConstraint = useStore((state) => state.addConstraint);
  const farApartStudent1 = useStore((state) => state.farApartStudent1);
  const farApartStudent2 = useStore((state) => state.farApartStudent2);
  const farApartMinDistance = useStore((state) => state.farApartMinDistance);
  const setFarApartStudent1 = useStore((state) => state.setFarApartStudent1);
  const setFarApartStudent2 = useStore((state) => state.setFarApartStudent2);
  const setFarApartMinDistance = useStore(
    (state) => state.setFarApartMinDistance,
  );

  const handleAddConstraint = () => {
    if (
      isValidStudentPair(farApartStudent1, farApartStudent2, students) &&
      farApartMinDistance > 0
    ) {
      const newConstraint: FarApartConstraint = {
        type: CONSTRAINT_TYPES.FAR_APART,
        student1: farApartStudent1,
        student2: farApartStudent2,
        minDistance: farApartMinDistance,
      };
      addConstraint(newConstraint);
      setFarApartStudent1("");
      setFarApartStudent2("");
    }
  };

  const handleMinDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFarApartMinDistance(value > 0 ? value : 1);
  };

  return {
    handleAddConstraint,
    handleMinDistanceChange,
  };
}
