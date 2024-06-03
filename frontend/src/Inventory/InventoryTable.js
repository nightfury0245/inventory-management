import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, IconButton, InputLabel, MenuItem, FormControl, Select 
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import Config from "../../Config";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const InventoryTable = () => {
  const [parts, setParts] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPart, setCurrentPart] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(Config.api_url + '/getInventory');
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
        await axios.delete(Config.api_url+`/deleteInventory/${id}`);
        fetchInventory();
      } catch (error) {
        console.error("Error deleting inventory item", error);
      }
    }
  };

  const handleEditSave = async () => {
    try {
      const formData = new FormData();
      formData.append('partName', currentPart.partName);
      formData.append('quantity', currentPart.quantity);
      formData.append('date', currentPart.date);
      formData.append('cost', currentPart.perPartPrice);
      formData.append('invoiceID', currentPart.invoiceNumber);
      formData.append('uom', currentPart.moi);
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }
      await axios.put(Config.api_url+`/updateInventory/${currentPart._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setOpenEditDialog(false);
      fetchInventory();
    } catch (error) {
      console.error("Error updating inventory item", error);
    }
  };

  const handleDownloadQRCode = (id) => {
    const canvas = document.getElementById(`qrcode-${id}`);
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleDownloadInvoice = (invoiceFile) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = Config.api_url+`/uploads/${invoiceFile}`;
    downloadLink.download = invoiceFile;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPart({ ...currentPart, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const checkDate = (date) => {
    const partDate = new Date(date);
    const currentDate = new Date();
    const expiryDate = new Date(partDate.setFullYear(partDate.getFullYear() + 5));
    return expiryDate >= currentDate;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
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
            <TableRow key={part._id}>
              <TableCell>{part.partName}</TableCell>
              <TableCell>{part.quantity}</TableCell>
              <TableCell>
                {part.date} {checkDate(part.date) ? <CheckCircleIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} />}
              </TableCell>
              <TableCell>
                <img src={Config.api_url+`/uploads/${part.imageFile}`} alt={part.partName} width="50" />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleViewClick(part)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => handleEditClick(part)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(part._id)}>
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
              <strong>ID:</strong> {currentPart._id}<br />
              <strong>Name:</strong> {currentPart.partName}<br />
              <strong>Quantity:</strong> {currentPart.quantity}<br />
              <strong>Date:</strong> {currentPart.date} {checkDate(currentPart.date) ? <CheckCircleIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} />}<br />
              <strong>Cost:</strong> {currentPart.cost}<br />
              <strong>UoM:</strong> {currentPart.uom}<br />
              <strong>Invoice ID:</strong> {currentPart.invoiceID}
            </DialogContentText>
            <img src={Config.api_url+`/uploads/${currentPart.imageFile}`} alt={currentPart.partName} width="100" />
            {currentPart._id && <QRCode id={`qrcode-${currentPart._id}`} value={currentPart._id} />}
          </DialogContent>
          <DialogActions>
            {currentPart._id && <Button onClick={() => handleDownloadQRCode(currentPart._id)}>Download QR Code</Button>}
            {currentPart.invoiceFile && <Button onClick={() => handleDownloadInvoice(currentPart.invoiceFile)}>Download Invoice</Button>}
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
              label="Cost"
              type="number"
              fullWidth
              name="cost"
              value={currentPart.perPartPrice}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Invoice ID"
              type="text"
              fullWidth
              name="invoiceID"
              value={currentPart.invoiceNumber}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="UoM"
              type="text"
              fullWidth
              name="uom"
              value={currentPart.moi}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              name="date"
              value={currentPart.date}
              InputProps={{ readOnly: true }}
              onChange={handleInputChange}
            />
            <InputLabel>Upload Image</InputLabel>
            <input
              type="file"
              onChange={handleImageChange}
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
