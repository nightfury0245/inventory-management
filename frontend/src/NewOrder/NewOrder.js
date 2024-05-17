import React, { useState, useEffect } from "react";
import "./NewOrder.css";
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
import { set } from "firebase/database";
import axios from 'axios'

const NewOrder = () => {
  const [partsData, setPartsData] = useState([
    { "Part Name": "Part A", "available quantity": 10 },
    { "Part Name": "Part B", "available quantity": 20 },
    { "Part Name": "Part C", "available quantity": 30 },
    { "Part Name": "Part D", "available quantity": 40 },
    { "Part Name": "Part E", "available quantity": 50 },
  ]);
  const [selectedPart, setSelectedPart] = useState("");
  const [orderName, setorderName] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(-1);
  const [orderItems, setOrderItems] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isHorizontalLayout, setIsHorizontalLayout] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsHorizontalLayout(window.innerWidth > 600);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/getInventory');
        if (response && response.data) {
          setPartsData(response.data);
        } else {
          console.error('Empty response or invalid data received from API');
        }
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchData(); // Initial call

    const interval = setInterval(fetchData, 5000); // Set up interval for every 5 seconds

    return () => {
      clearInterval(interval); // Clear interval on component unmount
    };
  }, []);

  const handleAddPart = () => {
    if (selectedPart && requiredQuantity > 0) {
      const existingIndex = orderItems.findIndex(
        (item) => item["Part Name"] === selectedPart
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
          pricePerUnit: getPricePerUnit(selectedPart),
        };
        setOrderItems([...orderItems, newOrderItem]);
      }
      // Reset input fields
      setSelectedPart("");
      setRequiredQuantity(1);
      setPricePerUnit(-1);
    }
    console.log("orderItems : ", orderItems);
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
      return total + item.quantity * item.pricePerUnit; // Calculate total cost
    }, 0);
  };

  const getPricePerUnit = (partName) =>{
    console.log("partname split" ,partName.split(':')[0]);
    const partObj = partsData.find(part => part["Part Name"] === partName.split(':')[0].trim());
    return partObj;
}

const handlePlaceOrder  = () => {
  console.log("Order placed");
}
  return (
    <React.Fragment>
      <div className={`new-order-container ${isHorizontalLayout ? "horizontal-layout" : "vertical-layout"}`}>
        <div className="new-order-form">
          <Typography variant="h4" gutterBottom>
            New Order
          </Typography>
          <TextField
            type="text"
            label="Order Name"
            value={orderName}
            onChange={(event) => setorderName(event.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: 16 }}
          />
          <Autocomplete
            options={partsData.map((part) => part["Part Name"] + " : " + part["available quantity"] + " available")}
            value={selectedPart}
            onChange={(event, newValue) => {setSelectedPart(newValue);
              setPricePerUnit(getPricePerUnit(newValue));
            }
            }
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
        </div>
        <div className={`divider ${isHorizontalLayout ? "vertical" : "horizontal"}`}></div>
        <div className="new-order-table">
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
                        <TableCell>{item.quantity * item.pricePerUnit}</TableCell> {/* Estimated Cost */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TextField
                label="Total Order Estimate"
                value={getTotalOrderCost()} // Display Total Order Estimate
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                style={{ marginTop: 16 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmation}>Go back and edit</Button>
              <Button onClick={handlePlaceOrder}>Place order</Button> {/* Call handlePlaceOrder function */}
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </React.Fragment>
  );
};

export default NewOrder;
