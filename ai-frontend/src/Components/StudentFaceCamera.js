import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function StudentFaceCamera({ onCapture }) {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {

    const loadModels = async () => {

      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      videoRef.current.srcObject = stream;
    };

    loadModels();

  }, []);

  const detectFace = async () => {

    if (!videoRef.current) return;

    const detection = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detection.length > 0 && !captured) {

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0);
      
      const imgData = canvas.toDataURL("image/jpeg");
      if(onCapture) {
        onCapture(imgData);
      }

      setCaptured(true);

      alert("Face Captured Successfully");

    }

  };

  useEffect(() => {

    const interval = setInterval(() => {
      detectFace();
    }, 2000);

    return () => clearInterval(interval);

  });

  return (

    <div style={{ textAlign:"center", marginTop:"15px" }}>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="260"
        height="200"
        style={{ borderRadius:"10px" }}
      />

      <canvas
        ref={canvasRef}
        style={{ display:"none" }}
      />

      {captured && (
        <p style={{color:"green"}}>Face captured successfully</p>
      )}

    </div>
  );
}

export default StudentFaceCamera;