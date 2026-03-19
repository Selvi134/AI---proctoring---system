import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";

function ExamCamera({ studentId, onProctorUpdate }) {
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 300,
    height: 200,
    facingMode: "user"
  };

  useEffect(() => {
    // 🚀 Send frames FAST (5 FPS)
    const interval = setInterval(() => {
      capture();
    }, 200); // ✅ every 200ms

    return () => clearInterval(interval);
  }, [studentId]);

  const capture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        try {
          const response = await fetch("http://localhost:8000/proctor/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              student_id: studentId,
              image: imageSrc
            })
          });

          const data = await response.json();

          console.log("AI Response:", data); // ✅ DEBUG

          if (onProctorUpdate) {
            onProctorUpdate(data);
          }

        } catch (err) {
          console.error("Proctoring analysis error:", err);
        }
      }
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      <div className="card shadow p-2" style={{ width: "220px" }}>
        <h6 className="text-center small mb-1">Live Monitoring</h6>

        <Webcam
          audio={false}
          height={150}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={200}
          videoConstraints={videoConstraints}
          className="rounded"
        />
      </div>
    </div>
  );
}

export default ExamCamera;