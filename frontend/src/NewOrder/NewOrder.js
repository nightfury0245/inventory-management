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
import axios from 'axios';
import Config from '../../Config';

const NewOrder = () => {
  const [partsData, setPartsData] = useState([
    { "partName": "Part A", "quantity": 10 },
    { "partName": "Part B", "quantity": 20 },
    { "partName": "Part C", "quantity": 30 },
    { "partName": "Part D", "quantity": 40 },
    { "partName": "Part E", "quantity": 50 },
  ]);
  const [selectedPart, setSelectedPart] = useState("");
  const [orderName, setOrderName] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [perPartPrice, setperPartPrice] = useState(-1);
  const [orderItems, setOrderItems] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isHorizontalLayout, setIsHorizontalLayout] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null); // New state for uploaded image

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
        const response = await axios.get(Config.api_url + '/getInventory');
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
        (item) => item["partName"] === selectedPart
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
          perPartPrice: getperPartPrice(selectedPart),
        };
        setOrderItems([...orderItems, newOrderItem]);
      }
      // Reset input fields
      setSelectedPart("");
      setRequiredQuantity(1);
      setperPartPrice(-1);
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
      return total + item.quantity * item.perPartPrice; // Calculate total cost
    }, 0);
  };

  const getperPartPrice = (partName) => {
    console.log("partname split", partName.split(':')[0]);
    const partObj = partsData.find(part => part["partName"] === partName.split(':')[0].trim());
    return partObj ? partObj["perPartPrice"] : -1;
  };

  const handlePlaceOrder = async (ordername, orderitems) => {
    try {
        console.log("Order placed");
        console.log(ordername, orderitems);
        const response = await axios.post(`${Config.api_url}/placeOrder`, {
            ordername,
            orderitems,
        });
        console.log(response.status);
        // reset all values once an order is placed successfully.
        setOrderName("");
        setOrderItems([]);
        setRequiredQuantity(1);
        setSelectedPart("");
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Error response:', error.response.data);
            console.log('Error status:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error message:', error.message);
        }
    }
    finally{
      // close the order confirmation page
      handleCloseConfirmation();
    }
};


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <React.Fragment>
      <div className={`new-order-container ${isHorizontalLayout ? "horizontal-layout" : "vertical-layout"}`}>
        <div className="new-order-form">
          <Typography variant="h4" gutterBottom>
            New Order
          </Typography>
          {uploadedImage && (
            <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
          )}
          <Button
            variant="contained"
            component="label"
            style={{ marginBottom: 16 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </Button>
          <TextField
            type="text"
            label="Order Name"
            value={orderName}
            onChange={(event) => setOrderName(event.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: 16 }}
          />
          <Autocomplete
            options={partsData.map((part) => part["partName"] + " : " + part["quantity"] + " available")}
            value={selectedPart}
            onChange={(event, newValue) => {
              setSelectedPart(newValue.split(':')[0].trim());
              setperPartPrice(getperPartPrice(newValue));
            }}
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
                  <TableCell>partName</TableCell>
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
                      <TableCell>partName</TableCell>
                      <TableCell>Required Quantity</TableCell>
                      <TableCell>Estimated Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.partName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.quantity * item.perPartPrice}</TableCell> {/* Estimated Cost */}
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
              <Button onClick={()=>handleCloseConfirmation}>Go back and edit</Button>
              <Button onClick={async()=>await handlePlaceOrder(orderName,orderItems)}>Place order</Button> {/* Call handlePlaceOrder function */}
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewOrder;
