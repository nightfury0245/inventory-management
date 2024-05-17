import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';

function AddPartDialog(props) {
  const { open, onClose, handleAddSave } = props;
  const [newPart, setNewPart] = useState({
    partName: '',
    moi: '',
    perPartPrice: '',
    invoiceFile: null,
    imageFile: null,
  });

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setNewPart((prevNewPart) => ({
      ...prevNewPart,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSaveClick = () => {
    handleAddSave(newPart);
    setNewPart({
      partName: '',
      moi: '',
      perPartPrice: '',
      invoiceFile: null,
      imageFile: null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Part</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <TextField
            margin="dense"
            label="Part Name"
            type="text"
            fullWidth
            variant="outlined"
            name="partName"
            value={newPart.partName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="MoI"
            type="text"
            fullWidth
            variant="outlined"
            name="moi"
            value={newPart.moi}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Per Part Price"
            type="number"
            fullWidth
            variant="outlined"
            name="perPartPrice"
            value={newPart.perPartPrice}
            onChange={handleInputChange}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              component="label"
              startIcon={<AttachFileIcon />}
            >
              Upload Invoice
              <input
                type="file"
                hidden
                name="invoiceFile"
                onChange={handleInputChange}
              />
            </Button>
          </Box>
          <Box mt={2}>
            <Button
              variant="contained"
              component="label"
              startIcon={<ImageIcon />}
            >
              Upload Image
              <input
                type="file"
                hidden
                name="imageFile"
                onChange={handleInputChange}
              />
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSaveClick} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

AddPartDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleAddSave: PropTypes.func.isRequired,
};

export default AddPartDialog;
