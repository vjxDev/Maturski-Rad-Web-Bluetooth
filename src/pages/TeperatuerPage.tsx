import { useContext } from "react";
import { ValueContext } from "../BLE/BLEProvider";

export const TeperatuerPage = () => {
  const { valueState } = useContext(ValueContext);
  return (
    <>
      <span>H:{valueState.environmentalSensing?.humidity}</span>

      <span>T:{valueState.environmentalSensing?.temperature}</span>
    </>
  );
};
