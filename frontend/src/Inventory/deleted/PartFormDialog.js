import React, { useState } from 'react';
import { Box, Button, TextField, Grid, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const PartForm = ({ part, handleSave }) => {
  const [formValues, setFormValues] = useState({
    partName: part?.partName || '',
    moi: part?.moi || '',
    perPartPrice: part?.perPartPrice || '',
    quantity: part?.quantity || '',
    additionalDetails: part?.additionalDetails || [{ key: '', value: '' }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAdditionalDetailChange = (index, e) => {
    const newDetails = formValues.additionalDetails.map((detail, i) =>
      i === index ? { ...detail, [e.target.name]: e.target.value } : detail
    );
    setFormValues({ ...formValues, additionalDetails: newDetails });
  };

  const handleAddDetail = () => {
    setFormValues({
      ...formValues,
      additionalDetails: [...formValues.additionalDetails, { key: '', value: '' }],
    });
  };

  const handleRemoveDetail = (index) => {
    const newDetails = formValues.additionalDetails.filter((_, i) => i !== index);
    setFormValues({ ...formValues, additionalDetails: newDetails });
  };

  const handleSaveClick = () => {
    handleSave(formValues);
  };

  return (
    <Box component="form" onSubmit={handleSaveClick} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Part Name"
            name="partName"
            value={formValues.partName}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="MoI"
            name="moi"
            value={formValues.moi}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Per Part Price"
            name="perPartPrice"
            type="number"
            value={formValues.perPartPrice}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Available Quantity"
            name="quantity"
            type="number"
            value={formValues.quantity}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        {formValues.additionalDetails.map((detail, index) => (
          <React.Fragment key={index}>
            <Grid item xs={5}>
              <TextField
                label="Detail Key"
                name="key"
                value={detail.key}
                onChange={(e) => handleAdditionalDetailChange(index, e)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Detail Value"
                name="value"
                value={detail.value}
                onChange={(e) => handleAdditionalDetailChange(index, e)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={2} container alignItems="center">
              <IconButton onClick={() => handleRemoveDetail(index)} color="secondary">
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddDetail} color="primary" startIcon={<AddCircleOutlineIcon />}>
            Add Detail
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PartForm;
