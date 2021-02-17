import { useContext } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { ValueContext } from "./BLE/BLEProvider";
import { useStatus } from "./BLE/hooks";
import { SideNav } from "./sidenav/SideNav";

export const Layout = () => {
  const { valueState } = useContext(ValueContext);
  const { connected, connecting, availability, failed } = useStatus();
  return (
    <div className="">
      <SideNav />
      <div className=" mb-28 sm:mb-0 sm:ml-52  h-full">
        {connected ? (
          <Switch>
            <Route exact path="/">
              <div className="h-screen flex items-center w-full">
                <div className="w-full grid grid-cols-3 grid-rows-1 h-28 text-center">
                  <Link to="/battery">
                    <span> Battery </span>
                  </Link>
                  <Link to="/heartrate">
                    <span> Heart Rate </span>
                  </Link>
                  <Link to="/heat">
                    <span> Temperature </span>
                  </Link>
                </div>
              </div>
            </Route>
            <Route path="/heat">
              <h1>Heat</h1>
              <span>{valueState.environmentalSensing?.temperature}</span>
            </Route>
            <Route path="/heartrate">
              <h1>Heartrate</h1>
              <span>{valueState.heartRate?.heartRate}</span>
            </Route>
            <Route path="/battery">
              <h1>Battery</h1>
              <span>{valueState.battery?.batteryLevel}</span>
            </Route>
            <Redirect to="/" />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/">
              <div className="flex h-screen justify-center items-center">
                {connecting ? (
                  <h1>Connecting...</h1>
                ) : (
                  <>
                    <h1 className="text-gray-800 text-xl">
                      Connect to a device
                    </h1>
                    {failed && <span>Faild to connect Try agen</span>}
                  </>
                )}
              </div>
            </Route>
            <Redirect to="/" />
          </Switch>
        )}
      </div>
    </div>
  );
};
