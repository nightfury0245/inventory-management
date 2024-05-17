import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import QRCode from 'qrcode.react';

function PartDetailsDialog(props) {
  const { open, onClose, detailRow, handleEditSave, editMode, setEditMode } = props;
  const [editedRow, setEditedRow] = useState(detailRow);

  const handleEditInputChange = (event) => {
    const { name, value, files } = event.target;
    setEditedRow((prevDetailRow) => ({
      ...prevDetailRow,
      [name]: files ? files[0] : value,
    }));
  };

  const generateQRCode = (partName, id) => {
    const qrCodeValue = `${partName} (ID: ${id})`;
    return (
      <QRCode value={qrCodeValue} size={128} />
    );
  };

  const handleSaveClick = () => {
    handleEditSave(editedRow);
    setEditMode(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Part Details</DialogTitle>
      <DialogContent>
        {detailRow && (
          <Box>
            <Typography variant="h6">{detailRow.partName}</Typography>
            <Typography variant="body1">Date: {detailRow.date}</Typography>
            <Typography variant="body1">MoI: {detailRow.moi}</Typography>
            <Typography variant="body1">Per Part Price: ${detailRow.perPartPrice}</Typography>
            <Box mt={2}>
              <Typography variant="body2">Invoice File:</Typography>
              {detailRow.invoiceFile ? (
                <Button variant="contained" component="a" href={URL.createObjectURL(detailRow.invoiceFile)} download>
                  Download Invoice
                </Button>
              ) : (
                <Typography variant="body2">No Invoice File Uploaded</Typography>
              )}
            </Box>
            <Box mt={2}>
              <Typography variant="body2">Image File:</Typography>
              {detailRow.imageFile ? (
                <Box component="img" src={URL.createObjectURL(detailRow.imageFile)} alt="Part Image" sx={{ width: '100%', maxHeight: 300 }} />
              ) : (
                <Typography variant="body2">No Image File Uploaded</Typography>
              )}
            </Box>
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                Edit
              </Button>
              <Box mt={2}>
                {generateQRCode(detailRow.partName, detailRow.id)}
              </Box>
            </Box>
          </Box>
        )}
        {editMode && detailRow && (
          <Box mt={2}>
            <TextField
              margin="dense"
              label="Part Name"
              type="text"
              fullWidth
              variant="outlined"
              name="partName"
              value={editedRow.partName}
              onChange={handleEditInputChange}
            />
            <TextField
              margin="dense"
              label="MoI"
              type="text"
              fullWidth
              variant="outlined"
              name="moi"
              value={editedRow.moi}
              onChange={handleEditInputChange}
            />
            <TextField
              margin="dense"
              label="Per Part Price"
              type="number"
              fullWidth
              variant="outlined"
              name="perPartPrice"
              value={editedRow.perPartPrice}
              onChange={handleEditInputChange}
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
                  onChange={handleEditInputChange}
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
                  onChange={handleEditInputChange}
                />
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        {editMode && (
          <Button onClick={handleSaveClick} color="primary">Save</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

PartDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  detailRow: PropTypes.object,
  handleEditSave: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
};

export default PartDetailsDialog;
