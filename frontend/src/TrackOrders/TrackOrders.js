import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { PhotoCamera, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Config from '../../Config';

const OrdersTab = ({ orders, onSelectOrder }) => {
  const handleOrderClick = (order) => {
    onSelectOrder(order);
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#fff", borderRadius: 1, boxShadow: 1, margin: 2 }}>
      <Typography variant="h5" gutterBottom>Orders</Typography>
      <List>
        {orders.map((order) => (
          <ListItem
            key={order._id.$oid}
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
                image={Config.api_url + "/uploads/" + order.orderImage || "default-image-path"}  // Use default image if not provided
                alt={order.ordername}
              />
            </ListItemAvatar>
            <ListItemText primary={order.ordername} secondary={order.status} />
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
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Save</Button>
    </Box>
  );
};

const OrderPreview = ({ selectedOrder, onEditPart, onDeletePart }) => {
  const [editingPart, setEditingPart] = useState(null);

  const handleEditClick = (partKey) => {
    setEditingPart(partKey);
  };

  const handleSavePart = async (partKey, editedPart) => {
    onEditPart(partKey, editedPart);
    setEditingPart(null);

    // Send the updated part to the backend
    try {
      await axios.put(`${Config.api_url}/updateInventory/${editedPart._id}`, editedPart);
    } catch (error) {
      console.error("Error updating inventory item:", error);
    }
  };

  const handleDeletePart = async (partKey) => {
    const partId = selectedOrder.orderitems[partKey]._id;
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${Config.api_url}/deleteInventory/${partId}`);
        onDeletePart(partKey);
      } catch (error) {
        console.error("Error deleting inventory item:", error);
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

  return (
    <Box sx={{ padding: 2, backgroundColor: "#fff", borderRadius: 1, boxShadow: 1, margin: 2 }}>
      <Typography variant="h5" gutterBottom>Order Preview</Typography>
      {selectedOrder && (
        <Box>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100, borderRadius: 1, mb: 2 }}
            image={Config.api_url + "/uploads/" + selectedOrder.orderImage || "default-image-path"}  // Use default image if not provided
            alt={selectedOrder.ordername}
          />
          <Typography variant="h6" gutterBottom>{selectedOrder.ordername}</Typography>
          <Typography variant="body1">Status: {selectedOrder.status}</Typography>
          <Typography variant="body1">Order ID: {selectedOrder._id.$oid}</Typography>
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
                        image={Config.api_url + "/uploads/" + item.partImage || "default-image-path"}  // Use default image if not provided
                        alt={item.partName}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1"><strong>{item.partName}:</strong></Typography>}
                      secondary={`${item.quantity} units, $${item.perPartPrice}`}
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
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${Config.api_url}/getOrders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order data:', error);
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

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <OrdersTab orders={orders} onSelectOrder={handleSelectOrder} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderPreview selectedOrder={selectedOrder} onEditPart={handleEditPart} onDeletePart={handleDeletePart} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackOrders;
