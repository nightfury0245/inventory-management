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

  const [showContainer, setShowContainer] = useState(true);

  const handleItemClick = (key) => {
    setState(prevState => ({ ...prevState, [key]: true }));
    setShowContainer(false);
  };

  const handleBackClick = () => {
    setState({
      newOrder: false,
      trackOrder: false,
      inventory: false,
      generateLabel: false
    });
    setShowContainer(true);
  };

  return (
    <>
      {showContainer && (
        <div className="container">
          <div className="item new-order" onClick={() => handleItemClick("newOrder")}>New Order</div>
          <div className="item track-orders" onClick={() => handleItemClick("trackOrder")}>Track orders</div>
          <div className="item inventory" onClick={() => handleItemClick("inventory")}>Inventory</div>
          <div className="item generate-label" onClick={() => handleItemClick("generateLabel")}>Generate label</div>
        </div>
      )}
      {state.newOrder && (<>
        <button className="back-button" onClick={handleBackClick}>Back</button>
        <div className="NewOrderContainer">
          <NewOrder />
        </div>
        </>
      )}
      {state.trackOrder && (
        <div>
          <button className="back-button" onClick={handleBackClick}>Back</button>
          <TrackOrders />
        </div>
      )}
      {state.inventory && (
        <div>
          <button className="back-button" onClick={handleBackClick}>Back</button>
          <Inventory />
        </div>
      )}
      {state.generateLabel && (
        <div>
          <button className="back-button" onClick={handleBackClick}>Back</button>
          <GenerateLabel />
        </div>
      )}
    </>
  );
}

export default App;
