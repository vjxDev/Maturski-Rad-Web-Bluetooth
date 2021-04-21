import { useContext } from "react";
import { ValueContext } from "../BLE/BLEProvider";

export const NavHeat = () => {
  const { valueState } = useContext(ValueContext);

  return (
    <div className="">
      <div className="">
        <svg className="h-6 w-6 mx-auto" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"
          />
        </svg>
        <span>Temperature</span>
        <span>H:{valueState.environmentalSensing?.humidity}</span>

        <span>T:{valueState.environmentalSensing?.temperature}</span>
      </div>
    </div>
  );
};
