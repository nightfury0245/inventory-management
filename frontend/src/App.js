// src/App.js
import React from "react";
import "./styles/dashboard.css";
function App() {
  return (
    <div className="root">
      <div id="dashboard-box">
        <div class="new-order item">
          <h1>New Order</h1>
        </div>

        <div class="track-order item">
          <h1>Track Order</h1>
        </div>

        <div class="inventory item">
          <h1>Inventory</h1>
        </div>

        <div class="generate-label item">
          <h1>Generate Label</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
