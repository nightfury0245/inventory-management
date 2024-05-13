import React, { useState } from 'react';
import './NewOrder.css'; // Assuming you have a CSS file for styling

function NewOrder() {
  const [orderName, setOrderName] = useState('');
  const [parts, setParts] = useState([{ partName: '', description: '' }]);

  const handleOrderNameChange = (e) => {
    setOrderName(e.target.value);
  };

  const handlePartChange = (index, e) => {
    const { name, value } = e.target;
    const newParts = [...parts];
    newParts[index][name] = value;
    setParts(newParts);
  };

  const handleAddPart = () => {
    setParts([...parts, { partName: '', description: '' }]);
  };

  const handleRemovePart = (index) => {
    if (parts.length > 1) {
      const newParts = [...parts];
      newParts.splice(index, 1);
      setParts(newParts);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderName.trim() === '') {
      alert('Please enter the order name.');
      return;
    }
    // if (parts.every(part => part.partName.trim() === '')) {
    //   alert('Please fill in at least one part name and description.');
    //   return;
    // }
    // Handle form submission here (e.g., send data to backend)
  };

  return (
    <div className="container">
      <h1>New Order</h1>
      <div className='new-order-form'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="order-input"
          placeholder="Order Name"
          value={orderName}
          onChange={handleOrderNameChange}
        />
        <div id="parts-container">
          {parts.map((part, index) => (
            <div className="part-input" key={index}>
              <input
                type="text"
                name="partName"
                placeholder="Part Name"
                value={part.partName}
                onChange={(e) => handlePartChange(index, e)}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={part.description}
                onChange={(e) => handlePartChange(index, e)}
              />
              {index > 0 && (
                <button
                  type="button"
                  className="remove-part-button"
                  onClick={() => handleRemovePart(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add-part-button"
          onClick={handleAddPart}
        >
          Add Part
        </button>
        <div>
          <button className="new-order-submit" type="submit">Submit</button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default NewOrder;
