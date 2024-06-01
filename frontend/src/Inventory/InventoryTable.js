import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import './InventoryTable.css'; // Import the CSS file

const InventoryTable = () => {
  const [parts, setParts] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPart, setCurrentPart] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/getInventory');
      setParts(response.data);
    } catch (error) {
      console.error("Error fetching inventory", error);
    }
  };

  const handleViewClick = (part) => {
    setCurrentPart(part);
    setOpenViewDialog(true);
  };

  const handleEditClick = (part) => {
    setCurrentPart(part);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/deleteInventory/${id}`);
        fetchInventory();
      } catch (error) {
        console.error("Error deleting inventory item", error);
      }
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/updateInventory/${currentPart._id.$oid}`, currentPart);
      setOpenEditDialog(false);
      fetchInventory();
    } catch (error) {
      console.error("Error updating inventory item", error);
    }
  };

  const handleDownloadQRCode = (id, name) => {
    const canvas = document.getElementById(`qrcode-${id}`);
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${name}-${id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleDownloadInvoice = (invoiceFile) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = `http://127.0.0.1:5000/uploads/${invoiceFile}`;
    downloadLink.download = invoiceFile;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPart({ ...currentPart, [name]: value });
  };

  return (
    <TableContainer component={Paper} className="table-container">
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Part Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parts.map((part) => (
            <TableRow key={part._id.$oid}>
              <TableCell>{part.partName}</TableCell>
              <TableCell>{part.quantity}</TableCell>
              <TableCell>{part.date}</TableCell>
              <TableCell>
                <img src={`http://127.0.0.1:5000/uploads/${part.imageFile}`} alt={part.partName} width="50" />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleViewClick(part)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => handleEditClick(part)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(part._id.$oid)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {currentPart && (
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
          <DialogTitle>Part Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>ID:</strong> {currentPart._id.$oid}<br />
              <strong>Name:</strong> {currentPart.partName}<br />
              <strong>Quantity:</strong> {currentPart.quantity}<br />
              <strong>Date:</strong> {currentPart.date}
            </DialogContentText>
            {currentPart._id && (
              <>
                <QRCode
                  id={`qrcode-${currentPart._id.$oid}`}
                  value={JSON.stringify({ id: currentPart._id.$oid, partName: currentPart.partName })}
                />
                <pre>{JSON.stringify({ id: currentPart._id.$oid, partName: currentPart.partName }, null, 2)}</pre>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {currentPart._id && (
              <Button onClick={() => handleDownloadQRCode(currentPart._id.$oid, currentPart.partName)}>
                Download QR Code
              </Button>
            )}
            {currentPart.invoiceFile && (
              <Button onClick={() => handleDownloadInvoice(currentPart.invoiceFile)}>
                Download Invoice
              </Button>
            )}
            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {currentPart && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Part</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              name="partName"
              value={currentPart.partName}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              name="quantity"
              value={currentPart.quantity}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              name="date"
              value={currentPart.date}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Image URL"
              type="text"
              fullWidth
              name="imageFile"
              value={currentPart.imageFile}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </TableContainer>
  );
};

export default InventoryTable;
