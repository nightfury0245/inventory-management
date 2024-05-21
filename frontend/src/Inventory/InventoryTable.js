import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';

const createData = (id, partName, date, moi, perPartPrice, invoiceFile, imageFile) => {
  return { id, partName, date, moi, perPartPrice, invoiceFile, imageFile };
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('parts', JSON.stringify(parts));
      formData.append('date', date);
      if (invoiceFile) {
        formData.append('invoiceFile', invoiceFile);
      }

      if (editMode) {
        await axios.put(`http://127.0.0.1:5000/updateInventory/${parts[0].id}`, formData);
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === parts[0].id ? { ...row, ...parts[0], date, invoiceFile } : row))
        );
      } else {
        const response = await axios.post('http://127.0.0.1:5000/addInventory', formData);
        const newPart = response.data;
        setRows((prevRows) => [...prevRows, newPart]);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const handleAddClick = () => {
    setShowPartForm(true); // Show part form when Add Part button is clicked
  };

  const handlePartChange = (index, event) => {
    const { name, value, files } = event.target;
    const updatedParts = [...parts];
    if (name === 'imageFile') {
      updatedParts[index][name] = files[0];
    } else {
      updatedParts[index][name] = value;
    }
    setParts(updatedParts);
  };

  const handleAddPart = () => {
    setParts([
      ...parts,
      {
        id: '',
        partName: '',
        moi: '',
        perPartPrice: '',
        imageFile: null,
        quantity: '',
        invoiceNumber: '',
      },
    ]);
  };

  const handleRemovePart = (index) => {
    const updatedParts = [...parts];
    updatedParts.splice(index, 1);
    setParts(updatedParts);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <EnhancedTableToolbar handleAddClick={handleAddClick} />
        <Grid container spacing={2} sx={{ p: 2 }}>
          {stableSort(rows, getComparator(order, orderBy)).map((row) => (
            <Grid item xs={12} md={6} lg={4} key={row.id}>
              <InventoryCard row={row} handleClick={handleClick} handleEdit={handleEdit} handleDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Inventory Part' : 'Add Inventory Part'}</DialogTitle>
        <DialogContent>
          {parts.map((part, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                name="partName"
                label="Part Name"
                type="text"
                fullWidth
                variant="standard"
                value={part.partName}
                onChange={(e) => handlePartChange(index, e)}
              />
              <TextField
                margin="dense"
                name="moi"
                label="Unit of Measurement"
                type="text"
                fullWidth
                variant="standard"
                value={part.moi}
                onChange={(e) => handlePartChange(index, e)}
              />
              <TextField
                margin="dense"
                name="perPartPrice"
                label="Per Part Price"
                type="number"
                fullWidth
                variant="standard"
                value={part.perPartPrice}
                onChange={(e) => handlePartChange(index, e)}
              />
              <TextField
                margin="dense"
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                variant="standard"
                value={part.quantity}
                onChange={(e) => handlePartChange(index, e)}
              />
              <TextField
                margin="dense"
                name="invoiceNumber"
                label="Invoice Number"
                type="text"
                fullWidth
                variant="standard"
                value={part.invoiceNumber}
                onChange={(e) => handlePartChange(index, e)}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`image-file-${index}`}
                type="file"
                name="imageFile"
                onChange={(e) => handlePartChange(index, e)}
              />
              <label htmlFor={`image-file-${index}`}>
                <Button variant="contained" component="span">
                  Upload Image
                  <AttachFileIcon />
                </Button>
                {part.imageFile && <span>{part.imageFile.name}</span>}
              </label>
              <Button onClick={() => handleRemovePart(index)} variant="outlined" color="secondary" sx={{ mt: 2 }}>
                Remove Part
              </Button>
            </Box>
          ))}
          <Button onClick={handleAddPart} variant="outlined" sx={{ mt: 2 }}>
            Add Another Part
          </Button>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="standard"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <input
            accept="application/pdf"
            style={{ display: 'none' }}
            id="invoice-file"
            type="file"
            name="invoiceFile"
            onChange={handleInvoiceFileUpload}
          />
          <label htmlFor="invoice-file">
            <Button variant="contained" component="span">
              Upload Invoice
              <AttachFileIcon />
            </Button>
            {invoiceFile && <span>{invoiceFile.name}</span>}
          </label>
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

      <Dialog open={detailOpen} onClose={handleDetailClose} maxWidth="md" fullWidth>
        <DialogTitle>Part Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Part Name: {detailRow.partName}</Typography>
          <Typography variant="body1">Unit of Measurement: {detailRow.moi}</Typography>
          <Typography variant="body1">Per Part Price: ${detailRow.perPartPrice}</Typography>
          <Typography variant="body1">Available Quantity: {detailRow.quantity}</Typography>
          <Box sx={{ mt: 2 }}>
            <QRCode value={JSON.stringify(detailRow)} id={`qr-${detailRow.id}`} />
            <Button variant="contained" onClick={() => downloadQRCode(detailRow.partName, detailRow.id)}>
              Download QR Code
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
