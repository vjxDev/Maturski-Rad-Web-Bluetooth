import { useContext } from "react";
import { ValueContext } from "../BLE/BLEProvider";
import { NavTextSmall, NavTitle, NavSubTitle } from "./NavText";

export const NavHeat = () => {
  const { valueState } = useContext(ValueContext);

  return (
    <>
      <NavTitle>Aplikacija</NavTitle>
      <NavSubTitle>
        <svg className="svg-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M11,9A4,4 0 0,1 15,13A4,4 0 0,1 11,17A4,4 0 0,1 7,13A4,4 0 0,1 11,9M11,11A2,2 0 0,0 9,13A2,2 0 0,0 11,15A2,2 0 0,0 13,13A2,2 0 0,0 11,11M7,4H14A4,4 0 0,1 18,8V9H16V8A2,2 0 0,0 14,6H7A2,2 0 0,0 5,8V20H16V18H18V22H3V8A4,4 0 0,1 7,4M16,11C18.5,11 18.5,9 21,9V11C18.5,11 18.5,13 16,13V11M16,15C18.5,15 18.5,13 21,13V15C18.5,15 18.5,17 16,17V15Z"
          />
        </svg>
        DHT Senzor
      </NavSubTitle>
      <div className="grid__2 text-center ">
        <h2>
          <svg className="svg-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"
            />
          </svg>
          {valueState.environmentalSensing?.temperature} C
        </h2>

        <h2>
          <svg className="svg-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z"
            />
          </svg>
          {valueState.environmentalSensing?.humidity} %
        </h2>
      </div>
      <div className="grid__2 text-center ">
        <div className="grid__2-inner">
          <NavTextSmall>Temperatura</NavTextSmall>
        </div>

        <div className="grid__2-inner">
          <NavTextSmall>
            Vlažnost <br /> vazduhaž
          </NavTextSmall>
        </div>
      </div>

      {/* <svg className="svg-icon" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"
        />
      </svg>
      <svg className="svg-icon" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z"
        />
      </svg>
      <span>Temperature</span>
      <span>H:{valueState.environmentalSensing?.humidity}</span>

      <span>T:{valueState.environmentalSensing?.temperature}</span> */}
    </>
  );
};
