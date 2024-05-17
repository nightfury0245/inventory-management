import React from 'react';
import QRCode from 'qrcode.react';
import { Box, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function GenerateLabel({ rows }) {
  const downloadQRCode = (partName, id) => {
    const canvas = document.getElementById(`qr-${id}`);
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${partName}-${id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Box>
      {rows.map(row => (
        <Box key={row.id} mb={4} display="flex" alignItems="center">
          <Box id={`qr-${row.id}`}>
            <QRCode value={`${row.partName} (ID: ${row.id})`} size={128} />
          </Box>
          <Box ml={2}>
            <Typography variant="body1">{row.partName} (ID: {row.id})</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => downloadQRCode(row.partName, row.id)}
            >
              Download QR Code
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

GenerateLabel.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    partName: PropTypes.string.isRequired,
  })).isRequired,
};

GenerateLabel.defaultProps = {
  rows: [],
};

export default GenerateLabel;
