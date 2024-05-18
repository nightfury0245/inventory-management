import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import imagePaths from "./imagePaths.json";

// Import image paths
const { pumpImages, partImages } = imagePaths;

const getRandomImage = (images) => images[Math.floor(Math.random() * images.length)];

const dummyOrders = [
  {
    id: 1,
    order_name: "Service Order 1",
    status: "completed",
    image: getRandomImage(pumpImages),
    data: {
      "Mechanical Part A": { quantity: 10, cost: "$100", expiration: "2024-12-31", image: getRandomImage(partImages) },
      "Electrical Part B": { quantity: 5, cost: "$200", expiration: "2024-11-30", image: getRandomImage(partImages) },
    },
  },
  {
    id: 2,
    order_name: "Service Order 2",
    status: "ongoing",
    image: getRandomImage(pumpImages),
    data: {
      "Mechanical Part C": { quantity: 8, cost: "$150", expiration: "2025-01-15", image: getRandomImage(partImages) },
      "Electrical Part D": { quantity: 3, cost: "$300", expiration: "2025-02-20", image: getRandomImage(partImages) },
    },
  },
  // Add more dummy orders as needed
];

const OrdersTab = ({ orders, onSelectOrder }) => {
  const handleOrderClick = (order) => {
    onSelectOrder(order);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "completed";
      case "ongoing":
        return "ongoing";
      case "haulted":
        return "haulted";
      case "aborted":
        return "aborted";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#fff", borderRadius: 1, boxShadow: 1, margin: 2 }}>
      <Typography variant="h5" gutterBottom>Orders</Typography>
      <List>
        {orders.map((order) => (
          <ListItem
            key={order.id}
            button
            onClick={() => handleOrderClick(order)}
            sx={{ borderLeft: 5, marginBottom: 1, ...(order.status === "completed" && { borderLeftColor: "#4caf50" }),
                ...(order.status === "ongoing" && { borderLeftColor: "#ffeb3b" }),
                ...(order.status === "haulted" && { borderLeftColor: "#f44336" }),
                ...(order.status === "aborted" && { borderLeftColor: "#9e9e9e" })
            }}
          >
            <ListItemAvatar>
              <CardMedia
                component="img"
                sx={{ width: 56, height: 56, borderRadius: "50%" }}
                image={order.image}
                alt={order.order_name}
              />
            </ListItemAvatar>
            <ListItemText primary={order.order_name} secondary={order.status} />
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedPart({ ...editedPart, image: reader.result });
    };
    reader.readAsDataURL(file);
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
        label="Cost"
        type="text"
        name="cost"
        value={editedPart.cost}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Expiration"
        type="date"
        name="expiration"
        value={editedPart.expiration}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<PhotoCamera />}
        >
          Upload Image
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
        {editedPart.image && (
          <CardMedia
            component="img"
            sx={{ width: 56, height: 56, borderRadius: 1, ml: 2 }}
            image={editedPart.image}
            alt="Part"
          />
        )}
      </Box>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Save</Button>
    </Box>
  );
};

const OrderPreview = ({ selectedOrder, onEditPart }) => {
  const [editingPart, setEditingPart] = useState(null);

  const handleEditClick = (partKey) => {
    setEditingPart(partKey);
  };

  const handleSavePart = (partKey, editedPart) => {
    onEditPart(partKey, editedPart);
    setEditingPart(null);
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
            image={selectedOrder.image}
            alt={selectedOrder.order_name}
          />
          <Typography variant="h6" gutterBottom>{selectedOrder.order_name}</Typography>
          <Typography variant="body1">Status: {selectedOrder.status}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Change Pump Image
              <input type="file" hidden onChange={handlePumpImageUpload} />
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>Data:</Typography>
          <List>
            {Object.entries(selectedOrder.data).map(([key, value]) => (
              <ListItem key={key} sx={{ alignItems: "flex-start" }}>
                {editingPart === key ? (
                  <PartEditForm part={value} partKey={key} onSave={handleSavePart} />
                ) : (
                  <>
                    <ListItemAvatar>
                      <CardMedia
                        component="img"
                        sx={{ width: 56, height: 56, borderRadius: 1 }}
                        image={value.image}
                        alt={key}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1"><strong>{key}:</strong></Typography>}
                      secondary={`${value.quantity} units, ${value.cost}, Expires on ${value.expiration}`}
                      sx={{ ml: 2 }}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(key)}
                      sx={{ ml: "auto" }}
                    >
                      Edit
                    </Button>
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

const Separator = () => <Divider sx={{ my: 2 }} />;

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // Uncomment the following lines to fetch data from the API
      // const response = await axios.get("http://192.168.1.9:3003/orders");
      // setOrders(response.data);

      // Use dummy data for now
      setOrders(dummyOrders);
    };

    fetchOrderDetails();
  }, []);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleEditPart = (partKey, editedPart) => {
    setSelectedOrder((prevOrder) => {
      if (partKey === "pumpImage") {
        return { ...prevOrder, image: editedPart };
      } else {
        return {
          ...prevOrder,
          data: {
            ...prevOrder.data,
            [partKey]: editedPart,
          },
        };
      }
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <OrdersTab orders={orders} onSelectOrder={handleSelectOrder} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderPreview selectedOrder={selectedOrder} onEditPart={handleEditPart} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackOrders;
