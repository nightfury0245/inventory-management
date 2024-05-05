import React from 'react';
import "./Order.css";
const Order = ({ order, onClose, onBack }) => {

const editPart = (part_name, data) => {
  console.log(part_name, data);
}
  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Order Details</h2>
        </div>
        <div className="popup-details">
          <p><strong>Order Name:</strong> {order.order_name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          {Object.keys(order.data).map(item=>(<div className="popup-parts">
            <p><b>{item}</b> : {order.data[item]}</p> 
            <button onClick={()=>{editPart(item, order.data[item])}} className='edit-btn'>edit</button>
            <button className='remove-btn'>remove</button>
            </div>
          ))}
          <button onClick={onClose}>Close</button>
          <button onClick={onBack}>Back</button> {/* Back button */}
        </div>
      </div>
    </div>
  );
};

export default Order;