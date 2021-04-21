import { useContext, useEffect, useRef, useState } from "react";
import { RgbColorPicker, RgbColor } from "react-colorful";
import { LightCharContext } from "../BLE/BLEProvider";

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
    <div className="">
      <svg className="h-6 w-6 mx-auto" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"
        />
      </svg>
      <span>Light</span>
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
    </div>
  );
};
