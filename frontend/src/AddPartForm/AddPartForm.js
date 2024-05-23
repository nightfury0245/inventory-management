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
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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

  const handleInvoiceUpload = async (event) => {
    const file = event.target.files[0];
    setInvoiceFile(file);
    if (file) {
      const formData = new FormData();
      formData.append('invoice', file);
      try {
        const response = await axios.post('http://127.0.0.1:5000/process_invoice', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = JSON.parse(response.data);
        const extractedParts = data.valid_sentences.map(sentence => ({
          partName: sentence.entities.partName || '',
          moi: sentence.entities.moi || '',
          perPartPrice: sentence.entities.perPartPrice || '',
          quantity: sentence.entities.quantity || '',
          invoiceNumber: sentence.entities.invoiceNumber || '',
          imageFile: null,
        }));
        setParts(extractedParts);
      } catch (error) {
        console.error('Error processing invoice:', error);
      }
    }
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
      alert('Parts saved successfully!');
    } catch (error) {
      console.error('Error saving parts:', error);
      alert('Failed to save parts');
    }
  };

  return (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>Add Part</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <input type="file" accept=".pdf" onChange={handleInvoiceUpload} />
          {parts.map((part, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={6}>
                <TextField
                  label="Part Name"
                  name="partName"
                  value={part.partName}
                  onChange={(event) => handlePartChange(index, event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="MOI"
                  name="moi"
                  value={part.moi}
                  onChange={(event) => handlePartChange(index, event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Per Part Price"
                  name="perPartPrice"
                  value={part.perPartPrice}
                  onChange={(event) => handlePartChange(index, event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={part.quantity}
                  onChange={(event) => handlePartChange(index, event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={part.invoiceNumber}
                  onChange={(event) => handlePartChange(index, event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<ImageIcon />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(event) => handleImageUpload(index, event)}
                  />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="contained"
            onClick={handlePartAdd}
            startIcon={<AttachFileIcon />}
          >
            Add Another Part
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
