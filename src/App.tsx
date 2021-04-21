import { BLEProvider } from "./BLE/BLEProvider";

import { HomePage } from "./pages/WelcomePage";
import { SideNav } from "./sidenav/SideNav";

function App() {
  return (
    <>
      <div className="title-bar"></div>

      <div className="layout-grid container">
        <main className="main">
          <HomePage />
        </main>
        <aside className="aside">
          <BLEProvider>
            <SideNav />
          </BLEProvider>
        </aside>
      </div>
    </>
  );
}

export default App;
