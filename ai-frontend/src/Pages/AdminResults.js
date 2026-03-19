import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/results/all")
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching results:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Detailed Student Results</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-3 p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Student ID</th>
                    <th>Exam Code</th>
                    <th>Score</th>
                    <th>Total Marks</th>
                    <th>Trust Score</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">No results found yet.</td>
                    </tr>
                  ) : (
                    results.map(r => (
                      <tr key={r.id}>
                        <td>{r.student_id}</td>
                        <td>{r.exam_id}</td>
                        <td className="fw-bold fs-5">{r.score}</td>
                        <td>{r.total_marks}</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <div className="progress flex-grow-1 me-2" style={{height: "8px", width: "100px"}}>
                                    <div 
                                        className={`progress-bar ${r.trust_score < 70 ? 'bg-danger' : 'bg-success'}`} 
                                        style={{width: `${r.trust_score}%`}}
                                    ></div>
                                </div>
                                <span>{r.trust_score}%</span>
                            </div>
                        </td>
                        <td>
                            <span className={`badge ${r.trust_score < 70 ? 'bg-danger' : 'bg-success'}`}>
                                {r.trust_score < 70 ? 'SUSPICIOUS' : 'NORMAL'}
                            </span>
                        </td>
                        <td className="small text-muted">{new Date(r.submitted_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="text-center mt-4">
          <a href="/admin-dashboard" className="btn btn-outline-secondary px-4">Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}

export default AdminResults;
