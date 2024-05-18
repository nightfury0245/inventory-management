import React, { useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, TextField } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas instead of QRCode

const PartDetailDialog = ({ open, handleClose, part, handleSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    partName: part.partName,
    moi: part.moi,
    perPartPrice: part.perPartPrice,
    quantity: part.quantity,
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSaveClick = () => {
    handleSave({ ...part, ...formValues });
    setIsEditing(false);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Part Details</DialogTitle>
      <DialogContent>
        {isEditing ? (
          <Box>
            <TextField
              margin="dense"
              label="Part Name"
              name="partName"
              value={formValues.partName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="MoI"
              name="moi"
              value={formValues.moi}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Per Part Price"
              name="perPartPrice"
              type="number"
              value={formValues.perPartPrice}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Available Quantity"
              name="quantity"
              type="number"
              value={formValues.quantity}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              {part.partName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>MoI:</strong> {part.moi}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Per Part Price:</strong> ${part.perPartPrice}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Available Quantity:</strong> {part.quantity}
            </Typography>
            {part.imageFile && (
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  <strong>Image:</strong>
                </Typography>
                <img src={URL.createObjectURL(part.imageFile)} alt={part.partName} style={{ maxWidth: '100%' }} />
              </Box>
            )}
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                <strong>QR Code:</strong>
              </Typography>
              <QRCodeCanvas value={`ID: ${part.id}, Name: ${part.partName}`} />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {isEditing ? (
          <Button onClick={handleSaveClick} color="primary">
            Save
          </Button>
        ) : (
          <Button onClick={handleEditClick} color="primary">
            Edit
          </Button>
        )}
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartDetailDialog;
