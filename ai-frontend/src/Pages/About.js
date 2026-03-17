import React from "react";
import Navbar from "../Components/Navbar";
import styles from "../styles/style.css";

function About() {
  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center mb-4">
          About AI Proctoring System
        </h1>

        <p className="lead text-center">
          Our AI-Based Online Exam Proctoring System ensures secure and fair
          online examinations using advanced artificial intelligence.
        </p>

        <div className="row mt-5">

          <div className="col-md-4 text-center rounded p-4 shadow hov">

            <h4>Face Recognition</h4>

            <p>
              Verifies student identity during login and continuously
              monitors presence throughout the exam.
            </p>

          </div>

          <div className="col-md-4 text-center rounded p-4 shadow hov">

            <h4>Audio Monitoring</h4>

            <p>
              Detects suspicious sounds or conversations using
              AI-based audio analysis.
            </p>

          </div>

          <div className="col-md-4 text-center rounded p-4 shadow hov">

            <h4>Real-Time Alerts</h4>

            <p>
              Sends alerts to the admin dashboard if suspicious
              activity is detected.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default About;