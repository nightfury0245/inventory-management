import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';

export default function AddPartForm() {
  const [parts, setParts] = useState([{
    partName: '',
    moi: '',
    perPartPrice: '',
    imageFile: null,
    quantity: '',
    invoiceNumber: '',
  }]);
  const [date, setDate] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);

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
      await Promise.all(parts.map(async (part) => {
        const formData = new FormData();
        formData.append('date', date);
        if (invoiceFile) {
          formData.append('invoiceFile', invoiceFile);
        }
        formData.append('partName', part.partName);
        formData.append('moi', part.moi);
        formData.append('perPartPrice', part.perPartPrice);
        formData.append('quantity', part.quantity);
        formData.append('invoiceNumber', part.invoiceNumber);
        if (part.imageFile) {
          formData.append('imageFile', part.imageFile);
        }

        await axios.post('http://127.0.0.1:5000/addInventory', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }));

      // Reset form fields after successful save
      setDate('');
      setInvoiceFile(null);
      setParts([{
        partName: '',
        moi: '',
        perPartPrice: '',
        imageFile: null,
        quantity: '',
        invoiceNumber: '',
      }]);
      
    } catch (error) {
      console.error('Error saving inventory:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <DialogTitle>Add Part</DialogTitle>
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
                  onChange={(event) => setInvoiceFile(event.target.files[0])}
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
        <Button onClick={() => {
          setDate('');
          setInvoiceFile(null);
          setParts([{
            partName: '',
            moi: '',
            perPartPrice: '',
            imageFile: null,
            quantity: '',
            invoiceNumber: '',
          }]);
        }} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Box>
  );
}
