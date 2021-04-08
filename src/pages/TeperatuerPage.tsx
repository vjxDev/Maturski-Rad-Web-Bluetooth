import { useContext } from "react";
import { ValueContext } from "../BLE/BLEProvider";

export const TeperatuerPage = () => {
  const { valueState } = useContext(ValueContext);
  return (
    <>
      <h1>Heat</h1>
      <p>
        <span>H:{valueState.environmentalSensing?.humidity}</span>
      </p>
      <p>
        <span>T:{valueState.environmentalSensing?.temperature}</span>
      </p>
    </>
  );
};
