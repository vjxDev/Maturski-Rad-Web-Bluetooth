import { useContext, useEffect, useRef, useState } from "react";
import { RgbColorPicker, RgbColor } from "react-colorful";
import { LightCharContext } from "../BLE/BLEProvider";
import { NavSubTitle } from "./NavText";

export const NavLight = () => {
  const [lightColor, setLightColor] = useState<RgbColor>({ r: 0, g: 0, b: 0 });
  const { lightChar } = useContext(LightCharContext);

  const changeColor = (c: RgbColor) => {
    setLightColor(c);
    color.current = c;
  };
  const dontWrite = useRef<boolean>(false);
  const color = useRef<RgbColor>({ r: 0, g: 0, b: 0 });
  const updateAgain = useRef<boolean>(false);

  const update = async () => {
    console.log(lightColor);
    if (lightChar === undefined || dontWrite.current) {
      console.log("skip update");
      updateAgain.current = true;
      return;
    }
    dontWrite.current = true;
    await lightChar?.writeValue(
      new Uint8Array([color.current.r, color.current.g, color.current.b])
    );
    await lightChar?.writeValue(
      new Uint8Array([color.current.r, color.current.g, color.current.b])
    );
    dontWrite.current = false;
  };

  useEffect(() => {
    update();
    // eslint-disable-next-line
  }, [lightColor]);

  return (
    <>
      <NavSubTitle>
        <svg className="svg-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z"
          />
        </svg>
        LED Dioda
      </NavSubTitle>
      <div className="grid__2">
        <div className="picker">
          <button
            tabIndex={0}
            className="swatch"
            style={{
              backgroundColor: `rgb(${color.current.r},${color.current.g},${color.current.b})`,
            }}
          />

          <div className="popover">
            <RgbColorPicker color={lightColor} onChange={changeColor} />
          </div>
        </div>
        <div className="table-grid">
          <span>Crvena:</span>
          <span className="ml-2">{color.current.r}</span>

          <span>Zelena:</span>
          <span className="ml-2">{color.current.g}</span>

          <span>Plava:</span>
          <span className="ml-2">{color.current.b}</span>
        </div>
      </div>
    </>
  );
};
