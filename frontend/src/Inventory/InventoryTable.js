import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ExpandableTableRow = ({ row }) => {
  const [open, setOpen] = useState(false);

  const handleDownloadInvoice = (invoiceId) => {
    console.log(`Downloading invoice with ID: ${invoiceId}`);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row['Part Name']}
        </TableCell>
        <TableCell>{row['Unit of measurement']}</TableCell>
        <TableCell>{`${Math.min(
          ...row.Quantity.map((item) => item['price per piece'])
        )} - ${Math.max(
          ...row.Quantity.map((item) => item['price per piece'])
        )}`}</TableCell>
        <TableCell>
          <IconButton
            aria-label="actions"
            size="small"
            onClick={() => handleDownloadInvoice(row.Quantity[0]['Invoice ID'])}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>MFD</TableCell>
                    <TableCell>Available Quantity</TableCell>
                    <TableCell>Price Per Piece</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Quantity.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.MFD}</TableCell>
                      <TableCell>{item['available quantity']}</TableCell>
                      <TableCell>{item['price per piece']}</TableCell>
                      <TableCell>{item['Expiry Date']}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="actions"
                          size="small"
                          onClick={() =>
                            handleDownloadInvoice(item['Invoice ID'])
                          }
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MaterialUITable = ({ data }) => {
  const [openForm, setOpenForm] = useState(false);
  const [formFields, setFormFields] = useState([
    {
      MFD: '',
      availableQuantity: '',
      pricePerPiece: '',
      expiryDate: '',
      invoice: '',
    },
  ]);

  const handleAddRow = () => {
    setFormFields([...formFields, { MFD: '', availableQuantity: '', pricePerPiece: '', expiryDate: '', invoice: '' }]);
  };

  const handleFormChange = (index, field, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };

  const handleSubmit = () => {
    console.log(formFields);
  };

  const fetchDataFromAPI = () => {
    // Fetch data from API
    console.log('Fetching data from API...');
  };

  useEffect(() => {
    const interval = setInterval(fetchDataFromAPI, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenForm(true)}
      >
        Add Part
      </Button>
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Add Part</DialogTitle>
        <DialogContent>
          {formFields.map((field, index) => (
            <Box key={index}>
              <TextField
                label="MFD"
                type="date"
                value={field.MFD}
                onChange={(e) => handleFormChange(index, 'MFD', e.target.value)}
              />
              <TextField
                label="Available Quantity"
                type="number"
                value={field.availableQuantity}
                onChange={(e) => handleFormChange(index, 'availableQuantity', e.target.value)}
              />
              <TextField
                label="Price Per Piece"
                type="number"
                value={field.pricePerPiece}
                onChange={(e) => handleFormChange(index, 'pricePerPiece', e.target.value)}
              />
              <TextField
                label="Expiry Date"
                type="date"
                value={field.expiryDate}
                onChange={(e) => handleFormChange(index, 'expiryDate', e.target.value)}
              />
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFormChange(index, 'invoice', e.target.files[0])}
              />
            </Box>
          ))}
          <Button onClick={handleAddRow}>Add Row</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={formFields.every(field => !field.MFD)}>Submit</Button>
        </DialogActions>
      </Dialog>
      {data && data.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Part Name</TableCell>
                <TableCell>Unit of measurement</TableCell>
                <TableCell>Price Range</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <ExpandableTableRow key={row.Item_id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default MaterialUITable;
