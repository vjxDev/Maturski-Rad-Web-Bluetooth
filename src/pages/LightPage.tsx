import { useContext, useEffect, useRef, useState } from "react";
import { RgbColorPicker, RgbColor } from "react-colorful";
import { useDebouncedCallback } from "use-debounce/lib";
import { LightCharContext } from "../BLE/BLEProvider";

export const LightPage = () => {
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
  }, [lightColor]);
  return (
    <div className="mt-10">
      <RgbColorPicker color={lightColor} onChange={changeColor} />
      <div
        onClick={update}
        className="w-10 h-10"
        style={{
          backgroundColor: ` rgb(${lightColor.r},${lightColor.g},${lightColor.b})`,
        }}
      ></div>
    </div>
  );
};
