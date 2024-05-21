// src/components/Camera/Camera.js

import React, { useEffect, useRef } from 'react';

export default function Camera() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    }

    enableCamera();

    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Camera</h2>
      <p>This is the Camera component.</p>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
    </div>
  );
}
