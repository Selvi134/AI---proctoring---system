import React from "react";
import { Link } from "react-router-dom";

function Cards() {
  return (

    <div className="container card-section">

      <div className="row">

        <div className="col-lg-6 col-md-12 mb-4">

          <div className="card p-4 shadow-sm">

            <h4>For Students</h4>

            <p>
              Take secure exams through AI-Based Online Exam Proctoring System
            </p>

            <Link to="/student-login" className="btn btn-primary mb-3">
              Student Login
              </Link>
            

            <ul className="feature-list">
              <li>Face Authentication</li>
              <li>Lockdown Mode</li>
              <li>Real-Time Monitoring</li>
            </ul>

          </div>

        </div>

        <div className="col-lg-6 col-md-12 mb-4">

          <div className="card p-4 shadow-sm">

            <h4>For Admin</h4>

            <p>
              Manage exams & monitor students with AI-powered dashboard.
            </p>

            <Link to="/admin-login" className="btn btn-outline-primary mb-3">
              Admin Login
              </Link>

            <ul className="feature-list">
              <li>Live Feed Monitoring</li>
              <li>Suspicion Scoring</li>
              <li>Detailed Reports</li>
            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cards;