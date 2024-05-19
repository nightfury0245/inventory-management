import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Toolbar from '@mui/material/Toolbar'; // Add this line


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
}

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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
}

const headCells = [
  { id: 'partName', numeric: false, disablePadding: true, label: 'Part Name' },
  { id: 'moi', numeric: false, disablePadding: false, label: 'Unit of Measurement' },
  { id: 'perPartPrice', numeric: true, disablePadding: false, label: 'Per Part Price' },
  { id: 'quantity', numeric: true, disablePadding: false, label: 'Available Quantity' },
];

function EnhancedTableToolbar(props) {
  const { numSelected, handleAddClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
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
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleAddClick: PropTypes.func.isRequired,
};

function InventoryCard(props) {
  const { row, handleClick, isSelected } = props;
  const labelId = `inventory-card-${row.id}`;

  return (
    <Card
      sx={{ minWidth: 275, marginBottom: 2, cursor: 'pointer' }}
      onClick={(event) => handleClick(event, row)}
    >
      <CardContent>
        <Checkbox
          color="primary"
          checked={isSelected}
          inputProps={{
            'aria-labelledby': labelId,
          }}
        />
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
      </CardContent>
    </Card>
  );
}

InventoryCard.propTypes = {
  row: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default function InventoryTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('partName');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState([{
    partName: '',
    moi: '',
    perPartPrice: '',
    imageFile: null,
  }]);
  const [date, setDate] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setdetailRow] = useState([]);
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

    fetchData(); // Initial call

    const interval = setInterval(fetchData, 5000); // Set up interval for every 5 seconds

    return () => {
      clearInterval(interval); // Clear interval on component unmount
    };
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    setdetailRow(row);
    setDetailOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setFormValues({
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} handleAddClick={handleAddClick} />
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {stableSort(rows, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              const isItemSelected = isSelected(row.id);
              return (
                <InventoryCard
                  key={row.id}
                  row={row}
                  handleClick={handleClick}
                  isSelected={isItemSelected}
                />
              );
            })}
        </Box>
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />

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
          <Typography color="text.secondary">
            Unit of Measurement: {detailRow.moi}
          </Typography>
          <Typography variant="body2">
            Per Part Price: ${detailRow.perPartPrice}
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
