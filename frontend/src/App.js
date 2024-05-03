// src/App.js
import React from 'react';
import "./styles/dashboard.css";
function App() {
    return (
        <div id="dashboard-box">
            <button>
            <div class="new-order item">
                <h1>New Order</h1>
            </div>
            </button>
            <button>
            <div class="track-order item">
                <h1>Track Order</h1>
            </div>
            </button>
            <button>
            <div class="inventory item">
                <h1>Inventory</h1>
            </div>
            </button>
            <button>
            <div class="generate-label item">
                <h1>Generate Label</h1>
            </div>
            </button>            
        </div>
    );
}

export default App;
