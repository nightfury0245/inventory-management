import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const NewOrder = () => {
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedMFD, setSelectedMFD] = useState(null);
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    // Fetch parts data from API
    fetchParts();
  }, []);

  const fetchParts = () => {
    // Fetch parts data from API
    // Replace this with your API call to fetch parts data
    const partsData = [{
      "Item_id": 2,
      "Part Name": "Part B",
      "Unit of measurement": "pcs",
      "Quantity": [
        {
          "MFD": "date1",
          "available quantity": 100,
          "part per pc": 30,
          "Expiry Date": "2024-06-13",
          "Invoice Document copy": "link_to_invoice",
          "Invoice number": "INV002"
        },
        {
          "MFD": "date2",
          "available quantity": 300,
          "part per pc": 40,
          "Expiry Date": "2024-06-13",
          "Invoice Document copy": "link_to_invoice",
          "Invoice number": "INV002"
        },
        {
          "MFD": "date3",
          "available quantity": 30,
          "part per pc": 50,
          "Expiry Date": "2024-06-13",
          "Invoice Document copy": "link_to_invoice",
          "Invoice number": "INV002"
        },
        {
          "MFD": "date4",
          "available quantity": 400,
          "part per pc": 60,
          "Expiry Date": "2024-06-13",
          "Invoice Document copy": "link_to_invoice",
          "Invoice number": "INV002"
        },
        {
          "MFD": "date5",
          "available quantity": 500,
          "part per pc": 70,
          "Expiry Date": "2024-06-13",
          "Invoice Document copy": "link_to_invoice",
          "Invoice number": "INV002"
        }
      ]
    }];

    setParts(partsData);
  };

  const handleAddPart = () => {
    if (selectedPart && selectedMFD) {
      const selectedQuantity = selectedPart.Quantity.find(quantity => quantity.MFD === selectedMFD);
      const availableQuantity = selectedQuantity ? selectedQuantity["available quantity"] : 0;

      const existingQuantity = orderItems.reduce((total, item) => {
        if (item["Item_id"] === selectedPart["Item_id"] && item.MFD === selectedMFD) {
          return total + item.requiredQuantity;
        }
        return total;
      }, 0);

      const totalQuantity = existingQuantity + requiredQuantity;

      if (totalQuantity > availableQuantity) {
        alert("The sum of the required quantity exceeds the available quantity of this part. Please enter a value within the acceptable range.");
        return;
      }

      const existingIndex = orderItems.findIndex(item => item["Item_id"] === selectedPart["Item_id"] && item.MFD === selectedMFD);
      if (existingIndex !== -1) {
        // If the part already exists in the order, update the quantity
        const updatedOrderItems = [...orderItems];
        updatedOrderItems[existingIndex].requiredQuantity += requiredQuantity;
        updatedOrderItems[existingIndex].total = updatedOrderItems[existingIndex].requiredQuantity * selectedQuantity['part per pc'];
        setOrderItems(updatedOrderItems);
        setTotalCost(calculateTotalCost(updatedOrderItems));
      } else {
        // If the part doesn't exist in the order, add it as a new row
        const total = requiredQuantity * selectedQuantity['part per pc'];
        const newOrderItem = { ...selectedPart, MFD: selectedMFD, requiredQuantity, total };
        setOrderItems([...orderItems, newOrderItem]);
        setTotalCost(totalCost + total);
      }
      setSelectedPart(null);
      setSelectedMFD(null);
      setRequiredQuantity(1);
    }
  };

  const handleRemovePart = (index) => {
    const removedItem = orderItems[index];
    setOrderItems(orderItems.filter((_, i) => i !== index));
    setTotalCost(totalCost - removedItem.total);
  };

  const handleConfirmOrder = () => {
    // Call function to place order
    console.log("Order Placed:", orderItems);
    setConfirmationOpen(false);
  };

  const calculateTotalCost = (items) => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        New Order
      </Typography>

      <Autocomplete
        options={parts}
        getOptionLabel={(part) => part["Part Name"]}
        value={selectedPart}
        onChange={(e, newValue) => {
          setSelectedPart(newValue);
          setSelectedMFD(null); // Reset selected MFD when changing the selected part
        }}
        renderInput={(params) => <TextField {...params} label="Select Part" variant="outlined" />}
        style={{ marginBottom: 16 }}
      />

<Autocomplete
        options={selectedPart ? selectedPart.Quantity.map(quantity => quantity.MFD) : []}
        value={selectedMFD}
        onChange={(e, newValue) => setSelectedMFD(newValue)}
        renderInput={(params) => <TextField {...params} label="Select MFD" variant="outlined" />}
        style={{ marginBottom: 16 }}
      />

      <TextField
        type="number"
        label="Required Quantity"
        value={requiredQuantity}
        onChange={(e) => setRequiredQuantity(e.target.value)}
        fullWidth
        variant="outlined"
        style={{ marginBottom: 16 }}
      />

      <Button variant="contained" onClick={handleAddPart} style={{ marginBottom: 16 }}>
        Add Part
      </Button>

      <TableContainer component={Paper} style={{ marginBottom: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Part Name</TableCell>
              <TableCell>MFD</TableCell>
              <TableCell>Number of units</TableCell>
              <TableCell>Per part price</TableCell>
              <TableCell>Total cost</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item["Part Name"]}</TableCell>
                <TableCell>{item.MFD}</TableCell>
                <TableCell>{item.requiredQuantity}</TableCell>
                <TableCell>{selectedPart && selectedPart.Quantity.find(quantity => quantity.MFD === item.MFD)["part per pc"]}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleRemovePart(index)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Button variant="contained" onClick={() => setConfirmationOpen(true)}>
        Continue
      </Button>

      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Order Confirmation</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Part Name</TableCell>
                  <TableCell>MFD</TableCell>
                  <TableCell>Number of units</TableCell>
                  <TableCell>Per part price</TableCell>
                  <TableCell>Total cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item["Part Name"]}</TableCell>
                    <TableCell>{item.MFD}</TableCell>
                    <TableCell>{item.requiredQuantity}</TableCell>
                    <TableCell>{selectedPart.Quantity.find(quantity => quantity.MFD === item.MFD)["part per pc"]}</TableCell>
                    <TableCell>{item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" style={{ marginTop: 16 }}>Estimated Total Cost: {totalCost}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>Go back and edit</Button>
          <Button onClick={handleConfirmOrder} color="primary">Confirm & place order</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewOrder;
