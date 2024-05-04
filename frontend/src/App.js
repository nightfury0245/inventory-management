import React, { useState } from "react";
import "./styles/dashboard.css";
import NewOrder from "./NewOrder/NewOrder.js";
import TrackOrders from "./TrackOrders/TrackOrders.js";
import Inventory from "./Inventory/Inventory.js";
import GenerateLabel from "./GenerateLabel/GenerateLabel.js";

function App() {
  const [state, setState] = useState({
    newOrder: false,
    trackOrder: false,
    inventory: false,
    generateLabel: false
  });

  const handleItemClick = (key) => {
    setState(prevState => ({ ...prevState, [key]: true }));
  };

  return (
    <>
      <div className="container">
        <div className="item new-order" onClick={() => handleItemClick("newOrder")}>New Order</div>
        <div className="item track-orders" onClick={() => handleItemClick("trackOrder")}>Track orders</div>
        <div className="item inventory" onClick={() => handleItemClick("inventory")}>Inventory</div>
        <div className="item generate-label" onClick={() => handleItemClick("generateLabel")}>Generate label</div>
      </div>
      {state.newOrder && window.location.assign("./NewOrder/NewOrder.js")}
      {state.trackOrder && <TrackOrders />}
      {state.inventory && <Inventory />}
      {state.generateLabel && <GenerateLabel />}
    </>
  );
}

export default App;
