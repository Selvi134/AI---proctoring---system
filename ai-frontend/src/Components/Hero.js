import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Side */}
          <div className="col-lg-6 col-md-12">

            <h1 className="hero-title">
              AI-Based Online Exam Proctoring System
            </h1>

            <p className="hero-text">
              Secure online exams with real-time AI monitoring:
              face recognition, audio analysis, and multi-face detection.
            </p>

            <Link to="/login" className="btn btn-primary me-3">
              Get Started
            </Link>

            <Link to="/about" className="btn btn-outline-secondary">
              Learn More
            </Link>

          </div>

          {/* Right Side */}
          <div className="col-lg-6 col-md-12 text-center mt-4 mt-lg-0">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              alt="student"
              className="hero-image"
            />

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;