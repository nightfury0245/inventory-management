import React, { useState, useEffect } from 'react';
import './TrackOrders.css';
import axios from 'axios';
import Order from './Order'; // Assuming the pop-up component is in a separate file

function TrackOrders() {
  const [orders, setOrders] = useState([{ order_name: 'Order 1', status: 'Status', data: 'Data' }]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage pop-up visibility

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get("http://192.168.49.54:3003/orders");
        setOrders(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrders();
    const interval = setInterval(getOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle click event and open pop-up
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  // Function to close the pop-up
  const handleClosePopup = () => {
    setSelectedOrder(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="track-order-container">
      {/* <h1>Track Your Orders</h1> */}
      <div className="orders">
        <ul>
          {orders.map(order => (
            <li key={order.order_name} onClick={() => handleOrderClick(order)}>
              <p>{order.order_name}</p>
              <p>{order.status}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Conditional rendering of the pop-up */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <Order
            order={selectedOrder}
            onClose={handleClosePopup}
            onBack={handleClosePopup} // Call handleClosePopup to close the pop-up
          />
        </div>
      )}
    </div>
  );
}

export default TrackOrders;
