import React from "react";
import { Link } from "react-router-dom";
import { NavBattery } from "./NavBattery";
import { NavConnect } from "./NavConnect";
import { NavHeartRate } from "./NavHeartRate";
import { NavHeat } from "./NavHeat";

export const SideNav = () => {
  return (
    <div className=" fixed left-0 bottom-0 right-0 sm:top-0 sm:right-auto sm:flex sm:items-center">
      <div className="h-24 sm:h-128 sm:w-52 border-t rounded-t-2xl sm:border-r sm:rounded-l-none sm:rounded-r-2xl shadow-xl overflow-hidden flex flex-col sm:justify-center bg-gray-100">
        <NavConnect />
        <nav className="h-16 sm:h-96 place-content-center border-t sm:border-none rounded">
          <ul className="grid grid-cols-3 grid-rows-1 sm:grid-cols-1 sm:grid-rows-3 h-full">
            <li className=" ">
              <Link to="battery">
                <NavBattery />
              </Link>
            </li>
            <li className=" ">
              <Link to="heartrate">
                <NavHeartRate />
              </Link>
            </li>
            <li className=" ">
              <Link to="heat">
                <NavHeat />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
