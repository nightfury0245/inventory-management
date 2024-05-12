import React, { useState, useEffect } from "react";
import "./TrackOrders.css";
import axios from "axios";
const OrdersTab = ({ orders, onSelectOrder }) => {
  return (
    <div className="orders-tab">
      <h2>Orders</h2>
      <div className="orders-data">
        <ul>
          {orders.map((order) => (
            <li key={order.order_name} onClick={() => handleOrderClick(order)}>
              <p>{order.order_name}</p>
              <p>{order.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const OrderPreview = ({ selectedOrder }) => {
  return (
    <div className="order-preview">
      <h2>Order Preview</h2>
      {selectedOrder && (
        <div>
          <h3>{selectedOrder.order_name}</h3>
          <p>Status: {selectedOrder.status}</p>
          <h4>Data:</h4>
          <ul>
            {Object.entries(selectedOrder.data).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Separator = () => {
  return <div className="separator"></div>;
};

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrderDetails = async () => {
    const response = await axios.get("http://192.168.1.9:3003/orders");
    setOrders(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="app">
      <OrdersTab orders={orders} onSelectOrder={handleSelectOrder} />
      <Separator />
      <OrderPreview selectedOrder={selectedOrder} />
    </div>
  );
};

export default TrackOrders;
