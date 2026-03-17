import React from "react";
import Webcam from "react-webcam";

function ExamCamera() {

  const videoConstraints = {
    width: 300,
    height: 200,
    facingMode: "user"
  };

  return (

    <div style={{position:"fixed",bottom:"20px",right:"20px"}}>

      <div className="card shadow p-2">

        <h6 className="text-center">Camera Monitoring</h6>

        <Webcam
          audio={false}
          height={200}
          width={300}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />

      </div>

    </div>

  );
}

export default ExamCamera;