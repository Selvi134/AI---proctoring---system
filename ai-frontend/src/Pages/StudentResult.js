import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function StudentResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const lastResult = localStorage.getItem("lastResult");
    if (lastResult) {
      setResult(JSON.parse(lastResult));
    } else {
      navigate("/student-login");
    }
  }, [navigate]);

  if (!result) return null;

  const trustStatus = result.trustScore < 70 ? "LOW TRUST (SUSPICIOUS)" : "GOOD TRUST (NORMAL)";

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-primary text-white text-center py-4">
                <h3>Exam Submission Complete</h3>
              </div>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <h1 className="display-1 fw-bold text-primary">{result.score}/{result.totalMarks}</h1>
                  <p className="text-muted fs-4">Final Score</p>
                </div>

                <div className="row g-4 text-center">
                  <div className="col-md-6">
                    <div className={`p-4 rounded-3 h-100 ${result.trustScore < 70 ? 'bg-danger-subtle border border-danger' : 'bg-success-subtle border border-success'}`}>
                      <h5>Trust Score</h5>
                      <h2 className={result.trustScore < 70 ? 'text-danger' : 'text-success'}>
                        {result.trustScore}%
                      </h2>
                      <span className={`badge ${result.trustScore < 70 ? 'bg-danger' : 'bg-success'}`}>
                        {trustStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="p-4 rounded-3 h-100 bg-light border">
                      <h5>Proctoring Summary</h5>
                      {result.reasons.length === 0 ? (
                        <p className="text-success small mb-0">No violations recorded.</p>
                      ) : (
                        <ul className="text-start small mb-0 ps-3">
                          {result.reasons.map((r, i) => (
                            <li key={i} className="text-danger">{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5 d-grid gap-2">
                  <button className="btn btn-outline-primary btn-lg" onClick={() => navigate("/student-login")}>
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-center text-muted mt-4 small">
              This report is generated automatically by the AI Proctoring System.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentResult;
