import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { PhotoCamera, Delete as DeleteIcon, Edit as EditIcon, CheckCircle, Cancel } from "@mui/icons-material";
import Config from '../../Config';

const OrdersTab = ({ orders, onSelectOrder, onUpdateOrderStatus }) => {
  const handleOrderClick = (order) => {
    onSelectOrder(order);
  };

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#fff", borderRadius: 1, boxShadow: 1, margin: 2 }}>
      <Typography variant="h5" gutterBottom>Orders</Typography>
      <List>
        {orders.map((order) => (
          <ListItem
            key={order._id}
            button
            onClick={() => handleOrderClick(order)}
            sx={{
              borderLeft: 5,
              marginBottom: 1,
              ...(order.status === "completed" && { borderLeftColor: "#4caf50" }),
              ...(order.status === "ongoing" && { borderLeftColor: "#ffeb3b" }),
              ...(order.status === "haulted" && { borderLeftColor: "#f44336" }),
              ...(order.status === "aborted" && { borderLeftColor: "#9e9e9e" })
            }}
          >
            <ListItemAvatar>
              <CardMedia
                component="img"
                sx={{ width: 56, height: 56, borderRadius: "50%" }}
                image={Config.api_url + "/uploads/" + (order.orderImage || "default-image-path")}
                alt={order.ordername}
              />
            </ListItemAvatar>
            <ListItemText primary={order.ordername} secondary={
              <FormControl fullWidth variant="standard">
                <InputLabel>Status</InputLabel>
                <Select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="haulted">Haulted</MenuItem>
                  <MenuItem value="aborted">Aborted</MenuItem>
                </Select>
              </FormControl>
            } />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const PartEditForm = ({ part, partKey, onSave }) => {
  const [editedPart, setEditedPart] = useState(part);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPart({ ...editedPart, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(partKey, editedPart);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", mt: 2, backgroundColor: "#f9f9f9", p: 2, borderRadius: 1, boxShadow: 1 }}>
      <TextField
        label="Quantity"
        type="number"
        name="quantity"
        value={editedPart.quantity}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        name="date"
        value={editedPart.date}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Save</Button>
    </Box>
  );
};

const OrderPreview = ({ selectedOrder, inventory, onEditPart, onDeletePart }) => {
  const [editingPart, setEditingPart] = useState(null);

  const handleEditClick = (partKey) => {
    setEditingPart(partKey);
  };

  const handleSavePart = async (partKey, editedPart) => {
    onEditPart(partKey, editedPart);
    setEditingPart(null);

    // Send the updated order to the backend
    try {
      const updatedOrder = {
        ...selectedOrder,
        orderitems: selectedOrder.orderitems.map((item, index) =>
          index === partKey ? editedPart : item
        ),
      };
      await axios.put(`${Config.api_url}/updateOrder/${selectedOrder._id}`, updatedOrder);
    } catch (error) {
      console.error("Error updating order item:", error);
    }
  };

  const handleDeletePart = async (partKey) => {
    const updatedOrderItems = selectedOrder.orderitems.filter((_, index) => index !== partKey);
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const updatedOrder = { ...selectedOrder, orderitems: updatedOrderItems };
        await axios.put(`${Config.api_url}/updateOrder/${selectedOrder._id}`, updatedOrder);
        onDeletePart(partKey);
      } catch (error) {
        console.error("Error deleting order item:", error);
      }
    }
  };

  const handlePumpImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      onEditPart("pumpImage", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const isApproved = (date) => {
    const currentDate = new Date();
    const partDate = new Date(date);
    const diffInYears = (currentDate - partDate) / (1000 * 60 * 60 * 24 * 365);
    return diffInYears < 5;
  };

  const getPartDate = (partId) => {
    console.log("Date:", partId);
    const part = inventory.find(item => item._id === partId);
    console.log("Found part:", part);
    return part ? part.date : 'N/A';
  };
  
  const getPartQuantity = (partId) => {
    console.log("Quantity:", partId);
    const part = selectedOrder.orderitems.find(item => item._id === partId);
    console.log("Found part:", part);
    return part ? part.quantity : 'N/A';
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#fff", borderRadius: 1, boxShadow: 1, margin: 2 }}>
      <Typography variant="h5" gutterBottom>Order Preview</Typography>
      {selectedOrder && (
        <Box>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100, borderRadius: 1, mb: 2 }}
            image={Config.api_url + "/uploads/" + (selectedOrder.orderImage || "default-image-path")}
            alt={selectedOrder.ordername}
          />
          <Typography variant="h6" gutterBottom>{selectedOrder.ordername}</Typography>
          <Typography variant="body1">Status: {selectedOrder.status}</Typography>
          <Typography variant="body1">Order ID: {selectedOrder._id}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Change Order Image
              <input type="file" hidden onChange={handlePumpImageUpload} />
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>Order Items:</Typography>
          <List>
            {selectedOrder.orderitems.map((item, index) => (
              <ListItem key={index} sx={{ alignItems: "flex-start" }}>
                {editingPart === index ? (
                  <PartEditForm part={item} partKey={index} onSave={handleSavePart} />
                ) : (
                  <>
                    <ListItemAvatar>
                      <CardMedia
                        component="img"
                        sx={{ width: 56, height: 56, borderRadius: 1 }}
                        image={Config.api_url + "/uploads/" + (item.partImage || "default-image-path")}
                        alt={item.partName}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          <strong>{item.partName}:</strong>
                        </Typography>
                      }
                      secondary={
                        <>
                          {getPartQuantity(item._id)} units, {getPartDate(item._id)}
                          <Box component="span" sx={{ ml: 1 }}>
                            {isApproved(getPartDate(item._id)) ? (
                              <CheckCircle sx={{ color: 'green' }} />
                            ) : (
                              <Cancel sx={{ color: 'red' }} />
                            )}
                          </Box>
                        </>
                      }
                      sx={{ ml: 2 }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                      <IconButton onClick={() => handleEditClick(index)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePart(index)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const ordersResponse = await axios.get(`${Config.api_url}/getOrders`);
        setOrders(ordersResponse.data);

        const inventoryResponse = await axios.get(`${Config.api_url}/getInventory`);
        setInventory(inventoryResponse.data);
      } catch (error) {
        console.error('Error fetching order data or inventory data:', error);
      }
    };

    fetchOrderDetails();
  }, []);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleEditPart = (partKey, editedPart) => {
    setSelectedOrder((prevOrder) => {
      const updatedOrderItems = [...prevOrder.orderitems];
      if (partKey === "pumpImage") {
        return { ...prevOrder, orderImage: editedPart };
      } else {
        updatedOrderItems[partKey] = editedPart;
        return {
          ...prevOrder,
          orderitems: updatedOrderItems,
        };
      }
    });
  };

  const handleDeletePart = (partKey) => {
    setSelectedOrder((prevOrder) => {
      const updatedOrderItems = prevOrder.orderitems.filter((_, index) => index !== partKey);
      return {
        ...prevOrder,
        orderitems: updatedOrderItems,
      };
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${Config.api_url}/updateOrder/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <OrdersTab orders={orders} onSelectOrder={handleSelectOrder} onUpdateOrderStatus={handleUpdateOrderStatus} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderPreview selectedOrder={selectedOrder} inventory={inventory} onEditPart={handleEditPart} onDeletePart={handleDeletePart} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackOrders;
