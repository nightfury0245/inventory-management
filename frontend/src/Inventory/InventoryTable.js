import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';






function EnhancedTableToolbar(props) {
  const { handleAddClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
        display="flex"
        alignItems="center"
      >
        Parts Inventory
        <Tooltip title="Add">
          <IconButton onClick={handleAddClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  handleAddClick: PropTypes.func.isRequired,
};

function InventoryCard(props) {
  const { row, handleClick, handleEdit, handleDelete } = props;

  return (
    <Card
      sx={{ minWidth: 275, marginBottom: 2, cursor: 'pointer' }}
      onClick={(event) => handleClick(event, row)}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {row.partName}
        </Typography>
        <Typography color="text.secondary">
          Unit of Measurement: {row.moi}
        </Typography>
        <Typography variant="body2">
          Per Part Price: ${row.perPartPrice}
        </Typography>
        <Typography variant="body2">
          Available Quantity: {row.quantity}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Tooltip title="Edit">
            <IconButton onClick={(e) => handleEdit(e, row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={(e) => handleDelete(e, row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

const downloadQRCode = (partName, id) => {
  setTimeout(() => {
    const svgContainer = document.getElementById(`qr-${id}`);
    if (!svgContainer) {
      console.error(`Container for QR code with id ${id} not found`);
      return;
    }

    const svgElement = svgContainer.querySelector('svg');
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${partName}-${id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.onerror = (err) => {
      console.error('Error loading the SVG image:', err);
    };
  }, 100);
};

InventoryCard.propTypes = {
  row: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default function InventoryTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('partName');
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState([{
    id: '',
    partName: '',
    moi: '',
    perPartPrice: '',
    imageFile: null,
    quantity: '',
    invoiceNumber: '',
  }]);
  const handleAddClick = () => {
    setOpen(true);
    setEditMode(false);
    setParts([{
      id: '',
      partName: '',
      moi: '',
      perPartPrice: '',
      imageFile: null,
      quantity: '',
      invoiceNumber: '',
    }]);
    setDate('');
    setInvoiceFile(null);
  };
  
  const [date, setDate] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [showPartForm, setShowPartForm] = useState(false); // New state for showing part form

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/getInventory');
        if (response && response.data) {
          setRows(response.data);
        } else {
          console.error('Empty response or invalid data received from API');
        }
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  const handleInvoiceFileUpload = (event) => {
    setInvoiceFile(event.target.files[0]);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  const handleClick = (event, row) => {
    setDetailRow(row);
    setDetailOpen(true);
  };

  const handleEdit = (event, row) => {
    event.stopPropagation();
    setParts([row]);
    setDate(row.date);
    setInvoiceFile(row.invoiceFile);
    setOpen(true);
    setEditMode(true);
  };

  const handleDelete = async (event, id) => {
    event.stopPropagation();
    try {
      await axios.delete(`http://127.0.0.1:5000/deleteInventory/${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting inventory:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setParts([{
      id: '',
      partName: '',
      moi: '',
      perPartPrice: '',
      imageFile: null,
      quantity: '',
      invoiceNumber: '',
    }]);
    setDate('');
    setInvoiceFile(null);
  };

  const handlePartChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const updatedParts = [...parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [name]: type === 'checkbox' ? checked : value,
    };
    setParts(updatedParts);
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    const updatedParts = [...parts];
    updatedParts[index] = {
      ...updatedParts[index],
      imageFile: file,
    };
    setParts(updatedParts);
  };

  const handlePartAdd = () => {
    setParts([...parts, {
      id: '',
      partName: '',
      moi: '',
      perPartPrice: '',
      imageFile: null,
      quantity: '',
      invoiceNumber: '',
    }]);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('date', date);
      formData.append('invoiceFile', invoiceFile);
  
      parts.forEach((part, index) => {
        formData.append(`parts[${index}][id]`, part.id);
        formData.append(`parts[${index}][partName]`, part.partName);
        formData.append(`parts[${index}][moi]`, part.moi);
        formData.append(`parts[${index}][perPartPrice]`, part.perPartPrice);
        formData.append(`parts[${index}][quantity]`, part.quantity);
        formData.append(`parts[${index}][invoiceNumber]`, part.invoiceNumber);
        if (part.imageFile) {
          formData.append(`parts[${index}][imageFile]`, part.imageFile);
        }
      });
  
      if (editMode) {
        await axios.put(`http://127.0.0.1:5000/updateInventory/${parts[0].id}`, formData);
      } else {
        await axios.post('http://127.0.0.1:5000/addInventory', formData);
      }
  
      const response = await axios.get('http://127.0.0.1:5000/getInventory');
      if (response && response.data) {
        setRows(response.data);
      } else {
        console.error('Empty response or invalid data received from API');
      }
  
      handleClose();
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };
  

  return (
    <Box sx={{ width: '100%' }}>
      <EnhancedTableToolbar handleAddClick={handleAddClick} />
      <Box sx={{ padding: 2 }}>
        {rows.map((row) => (
          <InventoryCard
            key={row.id}
            row={row}
            handleClick={handleClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Part' : 'Add Part'}</DialogTitle>
        <DialogContent>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<AttachFileIcon />}
                >
                  {invoiceFile ? invoiceFile.name : 'Upload Invoice'}
                  <input
                    type="file"
                    hidden
                    onChange={handleInvoiceFileUpload}
                  />
                </Button>
              </Grid>
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12}>
                    <TextField
                      label="Part Name"
                      name="partName"
                      value={part.partName}
                      onChange={(event) => handlePartChange(index, event)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Unit of Measurement"
                      name="moi"
                      value={part.moi}
                      onChange={(event) => handlePartChange(index, event)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Per Part Price"
                      name="perPartPrice"
                      value={part.perPartPrice}
                      onChange={(event) => handlePartChange(index, event)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Quantity"
                      name="quantity"
                      value={part.quantity}
                      onChange={(event) => handlePartChange(index, event)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Invoice Number"
                      name="invoiceNumber"
                      value={part.invoiceNumber}
                      onChange={(event) => handlePartChange(index, event)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<ImageIcon />}
                    >
                      {part.imageFile ? part.imageFile.name : 'Upload Image'}
                      <input
                        type="file"
                        hidden
                        onChange={(event) => handleImageUpload(index, event)}
                      />
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              onClick={handlePartAdd}
            >
              Add Another Part
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Part Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6" component="div">
            {detailRow.partName}
          </Typography>
          <Typography color="text.secondary">
            Unit of Measurement: {detailRow.moi}
          </Typography>
          <Typography variant="body2">
            Per Part Price: ${detailRow.perPartPrice}
          </Typography>
          <Typography variant="body2">
            Available Quantity: {detailRow.quantity}
          </Typography>
          <Typography variant="body2">
            Invoice Number: {detailRow.invoiceNumber}
          </Typography>
          <Typography variant="body2">
            Date: {detailRow.date}
          </Typography>
          {detailRow.imageFile && (
            <img
              src={URL.createObjectURL(detailRow.imageFile)}
              alt="Part"
              style={{ maxWidth: '100%', marginTop: '10px' }}
            />
          )}
          <Box sx={{ marginTop: '20px' }}>
            <div id={`qr-${detailRow.id}`}>
              <QRCode value={JSON.stringify(detailRow)} />
            </div>
            <Button
              variant="contained"
              onClick={() => downloadQRCode(detailRow.partName, detailRow.id)}
              sx={{ marginTop: '10px' }}
            >
              Download QR Code
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
