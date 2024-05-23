import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

export default function QrScanner() {
  const [data, setData] = useState('No result');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.async = true;
    script.onload = () => {
      console.log('OpenCV.js is ready');
      startVideo();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const startVideo = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((error) => {
          console.error('Error accessing the camera', error);
        });
    } else {
      alert('Your device does not support camera access');
    }
  };

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const interval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const mat = cv.matFromImageData(imageData);
        const qrCodeDetector = new cv.QRCodeDetector();
        const points = new cv.Mat();
        const straight_qrcode = new cv.Mat();

        const result = qrCodeDetector.detectAndDecode(mat, points, straight_qrcode);
        if (result) {
          setData(result);
          clearInterval(interval);
        }

        mat.delete();
        points.delete();
        straight_qrcode.delete();
      }
    }, 1000);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Scanner
        </Typography>
        <video ref={videoRef} style={{ display: 'none' }}></video>
        <canvas ref={canvasRef} style={{ width: '100%' }}></canvas>
        <Button variant="contained" color="primary" onClick={scanQRCode} style={{ marginTop: '20px' }}>
          Scan QR Code
        </Button>
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          {data}
        </Typography>
      </Paper>
    </Box>
  );
}
