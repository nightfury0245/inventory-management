import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const NewOrder = () => {
  const [partsData, setPartsData] = useState([
    { "part name": "Part 1", quantity: 10 },
    { "part name": "Part 2", quantity: 20 },
    { "part name": "Part 3", quantity: 30 },
    { "part name": "Part 4", quantity: 40 },
    { "part name": "Part 5", quantity: 50 },
    { "part name": "Part 6", quantity: 60 },
    { "part name": "Part 7", quantity: 70 },
    { "part name": "Part 8", quantity: 80 },
    { "part name": "Part 9", quantity: 90 },
    { "part name": "Part 10", quantity: 100 },
  ]);
  const [selectedPart, setSelectedPart] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleAddPart = () => {
    if (selectedPart && requiredQuantity > 0) {
      const existingIndex = orderItems.findIndex(
        (item) => item.partName === selectedPart
      );
      if (existingIndex !== -1) {
        // If the part already exists in the order, update the quantity
        const updatedOrderItems = [...orderItems];
        updatedOrderItems[existingIndex].quantity += requiredQuantity;
        setOrderItems(updatedOrderItems);
      } else {
        // If the part doesn't exist in the order, add it as a new row
        const newOrderItem = {
          partName: selectedPart,
          quantity: requiredQuantity,
        };
        setOrderItems([...orderItems, newOrderItem]);
      }
      // Reset input fields
      setSelectedPart("");
      setRequiredQuantity(1);
    }
  };

  const handleRemovePart = (index) => {
    const updatedOrderItems = [...orderItems];
    updatedOrderItems.splice(index, 1);
    setOrderItems(updatedOrderItems);
  };

  const handleConfirmOrder = () => {
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const getTotalOrderCost = () => {
    return orderItems.reduce((total, item) => {
      return total + item.quantity * getPartPrice(item.partName);
    }, 0);
  };

  const getPartPrice = (partName) => {
    // todo remember to send part id
    // Replace this with your logic to fetch the price of the part from the backend or any other source
    return 10; // Dummy price for demonstration
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        New Order
      </Typography>

      <Autocomplete
        options={partsData.map((part) => part["part name"] + " : "+ part["quantity"] + " available")}
        value={selectedPart}
        onChange={(event, newValue) => setSelectedPart(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Select Part" variant="outlined" />
        )}
        style={{ marginBottom: 16 }}
      />

      <TextField
        type="number"
        label="Required Quantity"
        value={requiredQuantity}
        onChange={(event) => setRequiredQuantity(parseInt(event.target.value))}
        fullWidth
        variant="outlined"
        style={{ marginBottom: 16 }}
      />

      <Button
        variant="contained"
        onClick={handleAddPart}
        style={{ marginBottom: 16 }}
      >
        Add Part
      </Button>

      <TableContainer component={Paper} style={{ marginBottom: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Part Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.partName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemovePart(index)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" onClick={handleConfirmOrder}>
        Continue
      </Button>

      <Dialog open={confirmationOpen} onClose={handleCloseConfirmation}>
        <DialogTitle>Order Summary</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Part Name</TableCell>
                  <TableCell>Required Quantity</TableCell>
                  <TableCell>Estimated Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.partName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.quantity * getPartPrice(item.partName)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" style={{ marginTop: 16 }}>
            Total Order Cost: {getTotalOrderCost()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Go back and edit</Button>
          <Button onClick={handleCloseConfirmation}>Place order</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewOrder;
