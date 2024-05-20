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
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid'; // Import Grid

const downloadQRCode = (partName, id) => {
  const svgElement = document.getElementById(`qr-${id}`).querySelector('svg');
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
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
  img.src = url;
};

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
  const [formValues, setFormValues] = useState({
    id: '',
    partName: '',
    moi: '',
    perPartPrice: '',
    imageFile: null,
  });
  const [date, setDate] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState({});
  const [editMode, setEditMode] = useState(false);

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

  const handleClick = (event, row) => {
    setDetailRow(row);
    setDetailOpen(true);
  };

  const handleEdit = (event, row) => {
    event.stopPropagation();
    setFormValues(row);
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
    setFormValues({
      id: '',
      partName: '',
      moi: '',
      perPartPrice: '',
      imageFile: null,
    });
  };

  const handleAddClick = () => {
    setOpen(true);
    setEditMode(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append('partName', formValues.partName);
    data.append('moi', formValues.moi);
    data.append('perPartPrice', formValues.perPartPrice);
    data.append('date', date);
    data.append('invoiceFile', invoiceFile);
    data.append('imageFile', formValues.imageFile);

    try {
      let response;
      if (editMode) {
        response = await axios.put(`http://127.0.0.1:5000/updateInventory/${formValues.id}`, data);
      } else {
        response = await axios.post('http://127.0.0.1:5000/addInventory', data);
      }
      console.log(response.data);
      setOpen(false);
      setEditMode(false);
      setFormValues({
        id: '',
        partName: '',
        moi: '',
        perPartPrice: '',
        imageFile: null,
      });
    } catch (error) {
      console.error('Error adding/updating inventory:', error);
    }
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}> {/* Add spacing from the top */}
      <Paper sx={{ mb: 2 }}>
        <EnhancedTableToolbar handleAddClick={handleAddClick} />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}> {/* Grid container */}
            {stableSort(rows, getComparator(order, orderBy)).map((row) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={row.id}> {/* Grid item with responsive columns */}
                <InventoryCard
                  row={row}
                  handleClick={handleClick}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Inventory' : 'Add Inventory'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="partName"
              label="Part Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formValues.partName}
              onChange={(e) => setFormValues({ ...formValues, partName: e.target.value })}
            />
            <TextField
              margin="dense"
              id="moi"
              label="Unit of Measurement"
              type="text"
              fullWidth
              variant="outlined"
              value={formValues.moi}
              onChange={(e) => setFormValues({ ...formValues, moi: e.target.value })}
            />
            <TextField
              margin="dense"
              id="perPartPrice"
              label="Per Part Price"
              type="number"
              fullWidth
              variant="outlined"
              value={formValues.perPartPrice}
              onChange={(e) => setFormValues({ ...formValues, perPartPrice: e.target.value })}
            />
            <TextField
              margin="dense"
              id="date"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{ mt: 2 }}
            >
              Upload Invoice File
              <input
                type="file"
                hidden
                onChange={(e) => setInvoiceFile(e.target.files[0])}
              />
            </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ mt: 2, ml: 2 }}
            >
              Upload Image File
              <input
                type="file"
                hidden
                onChange={(e) => setFormValues({ ...formValues, imageFile: e.target.files[0] })}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailOpen} onClose={handleDetailClose}>
        <DialogTitle>Part Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6" component="div">
            {detailRow.partName}
          </Typography>
          <Typography variant="body2">
            Available Quantity: {detailRow.quantity}
          </Typography>
          <QRCode id={`qr-${detailRow.id}`} value={JSON.stringify(detailRow)} size={256} level="H" includeMargin />
          <Button
            variant="contained"
            startIcon={<AttachFileIcon />}
            sx={{ mt: 2 }}
            onClick={() => downloadQRCode(detailRow.partName, detailRow.id)}
          >
            Download QR Code
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
