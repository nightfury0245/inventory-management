import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, IconButton, InputLabel, Accordion, AccordionSummary, AccordionDetails, 
  Typography 
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import Config from "../../Config";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const InventoryTable = () => {
  const [parts, setParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPart, setCurrentPart] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);
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

  const handleViewClick = (part, entry) => {
    setCurrentPart(part);
    setCurrentEntry(entry);
    setOpenViewDialog(true);
  };

  const handleEditClick = (part, entry) => {
    setCurrentPart(part);
    setCurrentEntry(entry);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = async (partId, entryIndex) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const updatedPart = { ...parts.find(part => part._id === partId) };
        updatedPart.inventoryEntries.splice(entryIndex, 1);
        await axios.put(Config.api_url + `/updateInventory/${partId}`, updatedPart);
        fetchInventory();
      } catch (error) {
        console.error("Error deleting inventory item", error);
      }
    }
  };

  const handleEditSave = async () => {
    try {
      const updatedPart = { ...currentPart };
      updatedPart.inventoryEntries[currentPart.inventoryEntries.indexOf(currentEntry)] = currentEntry;
      const formData = new FormData();
      formData.append('part', JSON.stringify(updatedPart));
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }
      await axios.put(Config.api_url + `/updateInventory/${currentPart._id}`, formData, {
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

  const handleDownloadInvoice = (invoiceFile) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = Config.api_url + `/uploads/${invoiceFile}`;
    downloadLink.download = invoiceFile;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry({ ...currentEntry, [name]: value });
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

  const getOldestImage = (entries) => {
    if (entries.length === 0) return '';
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    return entries[0].imageFile;
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      <TextField
        label="Search Parts"
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
      {parts.filter(part => part.partName.toLowerCase().includes(searchTerm.toLowerCase())).map((part) => (
        <Accordion key={part._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <img src={Config.api_url + `/uploads/${getOldestImage(part.inventoryEntries)}`} alt={part.partName} width="50" />
                  </TableCell>
                  <TableCell>{part.partName}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      <span style={{ color: 'green' }}>Available: {part.freeQuantity}</span> / <span style={{ color: 'blue' }}>Total: {part.totalQuantity}</span>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {part.inventoryEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.quantity}</TableCell>
                    <TableCell>{entry.date} {checkDate(entry.date) ? <CheckCircleIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} />}</TableCell>
                    <TableCell>{entry.invoiceNumber}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewClick(part, entry)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(part, entry)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(part._id, index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}

      {currentPart && currentEntry && (
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
          <DialogTitle>Part Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>ID:</strong> {currentPart._id}<br />
              <strong>Name:</strong> {currentPart.partName}<br />
              <strong>Quantity:</strong> {currentEntry.quantity}<br />
              <strong>Date:</strong> {currentEntry.date} {checkDate(currentEntry.date) ? <CheckCircleIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} />}<br />
              <strong>Cost:</strong> {currentEntry.perPartPrice}<br />
              <strong>Invoice Number:</strong> {currentEntry.invoiceNumber}
            </DialogContentText>
            {currentEntry.imageFile && (
              <img src={Config.api_url + `/uploads/${currentEntry.imageFile}`} alt={currentPart.partName} width="100" />
            )}
          </DialogContent>
          <DialogActions>
            {currentEntry.invoiceFile && <Button onClick={() => handleDownloadInvoice(currentEntry.invoiceFile)}>Download Invoice</Button>}
            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {currentPart && currentEntry && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              name="quantity"
              value={currentEntry.quantity}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Cost"
              type="number"
              fullWidth
              name="perPartPrice"
              value={currentEntry.perPartPrice}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Invoice Number"
              type="text"
              fullWidth
              name="invoiceNumber"
              value={currentEntry.invoiceNumber}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              name="date"
              value={currentEntry.date}
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
