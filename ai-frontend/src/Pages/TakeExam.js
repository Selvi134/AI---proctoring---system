import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExamCamera from "../Components/ExamCamera";

function TakeExam() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [examId, setExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Proctoring State
  const [trustScore, setTrustScore] = useState(100);
  const [reasons, setReasons] = useState([]);

  const studentId = localStorage.getItem("studentId");
  const examCode = localStorage.getItem("examCode");

  useEffect(() => {
    if (!studentId || !examCode) {
        navigate("/student-login");
        return;
    }

    // 1. Fetch Exam Info
    fetch(`http://localhost:8000/exams/code/${examCode}`)
      .then(res => res.json())
      .then(examData => {
        setExamId(examData.id);
        setTimeLeft(examData.total_time * 60);

        // 2. Fetch Questions
        return fetch(`http://localhost:8000/exams/${examData.id}/questions`);
      })
      .then(res => res.json())
      .then(questionsData => {
        setQuestions(questionsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading exam:", err);
        alert("Failed to load exam.");
        navigate("/student-login");
      });
  }, [examCode, navigate, studentId]);

  useEffect(() => {
    if (timeLeft <= 0 && !loading) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const handleProctorUpdate = (data) => {
    setTrustScore(data.trust_score);
    if (data.reasons && data.reasons.length > 0) {
        // Add new reasons if they are not already there
        setReasons(prev => {
            const newReasons = [...prev];
            data.reasons.forEach(r => {
                if (!newReasons.includes(r)) {
                    newReasons.push(r);
                }
            });
            return newReasons;
        });
    }
  };

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    let score = 0;
    let totalMarks = 0;

    questions.forEach(q => {
      totalMarks += q.marks;
      if (answers[q.id] === q.correct_option) {
        score += q.marks;
      }
    });

    fetch("http://localhost:8000/results?student_id=" + studentId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam_id: examId,
        score: score,
        total_marks: totalMarks,
        trust_score: Math.round(trustScore)
      })
    })
      .then(res => res.json())
      .then(data => {
        // Save results to local storage for the dashboard
        localStorage.setItem("lastResult", JSON.stringify({
            score,
            totalMarks,
            trustScore: Math.round(trustScore),
            reasons
        }));
        navigate("/student-result");
      })
      .catch(err => alert("Error submitting results"));
  };

  if (loading) return <div className="text-center mt-5"><h3>Loading Exam...</h3></div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const status = trustScore < 70 ? "SUSPICIOUS" : "NORMAL";

  return (
    <div className="container-fluid mt-4 px-5">
      <div className="d-flex justify-content-between sticky-top bg-white p-3 shadow-sm mb-4 rounded">
        <div>
            <h4>Exam: <span className="text-primary">{examCode}</span></h4>
            <h6>Student ID: <span className="text-muted">{studentId}</span></h6>
        </div>
        <div className="text-center">
            <h4 className={timeLeft < 60 ? "text-danger animate-pulse" : "text-dark"}>
                Time Left: {minutes}:{seconds < 10 ? '0'+seconds : seconds}
            </h4>
        </div>
        <div className="text-end">
            <h5 className={trustScore < 70 ? "text-danger" : "text-success"}>
                Trust Score: {Math.round(trustScore)}%
            </h5>
            <span className={`badge ${trustScore < 70 ? "bg-danger" : "bg-success"}`}>
                Status: {status}
            </span>
        </div>
      </div>

      <div className="row">
        <div className="col-md-9">
          <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <div key={q.id} className="card shadow-sm p-4 mb-4 border-0">
                <h5 className="border-bottom pb-2">
                    <span className="badge bg-secondary me-2">{index + 1}</span>
                    {q.question_text} 
                    <span className="float-end small text-muted font-monospace">{q.marks} pts</span>
                </h5>
                
                <div className="mt-3">
                  {[1, 2, 3, 4].map(opt => (
                    <div key={opt} className={`form-check p-3 mb-2 rounded border ${answers[q.id] === opt ? "bg-light border-primary" : "border-transparent"}`} style={{cursor: "pointer"}} onClick={() => handleOptionChange(q.id, opt)}>
                      <input
                        className="form-check-input ms-0"
                        type="radio"
                        name={`question-${q.id}`}
                        id={`q${q.id}-opt${opt}`}
                        onChange={() => handleOptionChange(q.id, opt)}
                        checked={answers[q.id] === opt}
                      />
                      <label className="form-check-label ms-4 w-100" style={{cursor: "pointer"}}>
                        {q[`option${opt}`]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="text-center mb-5">
              <button type="submit" className="btn btn-primary btn-lg px-5 shadow">Submit Final Exam</button>
            </div>
          </form>
        </div>
        
        <div className="col-md-3">
          <div className="sticky-top" style={{ top: "100px" }}>
            <ExamCamera studentId={studentId} onProctorUpdate={handleProctorUpdate} />
            
            <div className="card p-3 shadow-sm border-0 bg-light">
                <h6 className="border-bottom pb-2">Monitoring Alerts</h6>
                {reasons.length === 0 ? (
                    <p className="small text-success">✓ No suspicious activity detected.</p>
                ) : (
                    <ul className="ps-3 mb-0">
                        {reasons.map((r, i) => (
                            <li key={i} className="small text-danger mb-1">{r}</li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="card p-3 mt-3 shadow-sm border-0">
                <p className="small text-muted mb-0">
                    <i className="bi bi-info-circle me-1"></i>
                    Please stay within the camera frame and avoid looking away. Continuous violations will result in a low trust score.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeExam;
