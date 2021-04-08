import { Redirect, Route, Switch } from "react-router-dom";
import { useStatus } from "./BLE/hooks";
import { BatteryPage } from "./pages/BatteryPage";
import { ConnectPage } from "./pages/ConnectPage";
import { LightPage } from "./pages/LightPage";
import { TeperatuerPage } from "./pages/TeperatuerPage";
import { HomePage, WelcomePage } from "./pages/WelcomePage";
import { SideNav } from "./sidenav/SideNav";

export const Layout = () => {
  const { connected } = useStatus();

  return (
    <div className="p-4 md:p-8 lg:px-12 flex flex-col sm:justify-center sm:flex-row min-h-screen bg-gradient-to-br from-cyan-400 to-lightBlue-500  antialiased space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-12">
      <div className=" p-4 md:p-8 md:w-full lg:max-w-4xl min-h-128 bg-white border-4 border-lime-400 rounded-3xl">
        {connected ? (
          <Switch>
            <Route exact path="/" component={WelcomePage} />
            <Route path="/heat" component={TeperatuerPage} />
            <Route path="/light" component={LightPage} />
            <Route path="/battery" component={BatteryPage} />
            <Redirect to="/" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/" component={HomePage} />
          </Switch>
        )}
      </div>
      <SideNav />
    </div>
  );
};
