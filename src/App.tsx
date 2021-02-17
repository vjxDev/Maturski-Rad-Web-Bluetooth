import { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { BLEContext, TyValue, ValueContext } from "./BLE/context";

import { Layout } from "./Layout";

function App() {
  const { valueState, valueDispatch } = useContext(ValueContext);
  const { BLEstate, BLEdispatch } = useContext(BLEContext);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
