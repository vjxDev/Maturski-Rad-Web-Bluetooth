import React from "react";
import { Link } from "react-router-dom";
import { useStatus } from "../BLE/hooks";
import { NavBattery } from "./NavBattery";
import { NavConnect } from "./NavConnect";

import { NavHeat } from "./NavHeat";
import { NavLight } from "./NavLight";

export const SideNav = () => {
  const { connected } = useStatus();

  return (
    <div className=" sm:flex sm:items-center flex-col justify-center">
      <div className=" space-y-2 sm:h-128 sm:w-52  flex flex-col sm:justify-center ">
        <NavConnect />
        {connected && (
          <nav className="  h-20 sm:h-96 place-content-center   ">
            <ul className=" sm:py-0 grid grid-cols-3 grid-rows-1 sm:grid-cols-1 sm:grid-rows-3 h-full overflow-hidden rounded-3xl shadow-xl bg-white">
              <li className=" ">
                <Link to="heat">
                  <NavHeat />
                </Link>
              </li>
              <li className=" ">
                <Link to="light">
                  <NavLight />
                </Link>
              </li>
              <li className=" ">
                <Link to="battery">
                  <NavBattery />
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};
