import React, { useState } from "react";
import Navbar from "../Components/Navbar";

function AdminDashboard() {
  const [examCode, setExamCode] = useState("");
  const [totalTime, setTotalTime] = useState(30);
  const [examId, setExamId] = useState(null);

  const [questionText, setQuestionText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState(1);
  const [marks, setMarks] = useState(1);

  const handleCreateExam = (e) => {
    e.preventDefault();
    const adminId = localStorage.getItem("adminId");

    fetch("http://localhost:8000/exams?admin_id=" + adminId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam_code: examCode.trim(),
        total_time: totalTime
      })
    })
      .then(res => res.json())
      .then(data => {
        setExamId(data.id);
        alert("Exam Created! Now add questions.");
      })
      .catch(err => alert("Error creating exam"));
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!examId) {
      alert("Please create an exam first!");
      return;
    }

    fetch(`http://localhost:8000/exams/${examId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_text: questionText,
        option1,
        option2,
        option3,
        option4,
        correct_option: parseInt(correctOption),
        marks: parseInt(marks)
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Question Added!");
        setQuestionText("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
      })
      .catch(err => alert("Error adding question"));
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Admin Dashboard - Manage Exams</h2>
        
        <div className="row">
          <div className="col-md-5">
            <div className="card p-4 shadow mb-4">
              <h4>1. Create New Exam</h4>
              <form onSubmit={handleCreateExam}>
                <div className="mb-3">
                  <label className="form-label">Exam Code</label>
                  <input type="text" className="form-control" value={examCode} onChange={(e) => setExamCode(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Time (minutes)</label>
                  <input type="number" className="form-control" value={totalTime} onChange={(e) => setTotalTime(e.target.value)} required />
                </div>
                <button className="btn btn-success w-100">Create Exam</button>
              </form>
            </div>
            
            <div className="text-center mt-3">
                <a href="/admin-results" className="btn btn-info w-100">View Student Results</a>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card p-4 shadow">
              <h4>2. Add Questions</h4>
              <form onSubmit={handleAddQuestion}>
                <div className="mb-3">
                  <label className="form-label">Question Text</label>
                  <textarea className="form-control" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label>Option 1</label>
                    <input type="text" className="form-control" value={option1} onChange={(e) => setOption1(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Option 2</label>
                    <input type="text" className="form-control" value={option2} onChange={(e) => setOption2(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Option 3</label>
                    <input type="text" className="form-control" value={option3} onChange={(e) => setOption3(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Option 4</label>
                    <input type="text" className="form-control" value={option4} onChange={(e) => setOption4(e.target.value)} required />
                  </div>
                </div>
                <div className="mb-3 mt-2">
                  <label className="form-label">Correct Option (1-4)</label>
                  <input type="number" className="form-control" min="1" max="4" value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Marks</label>
                  <input type="number" className="form-control" value={marks} onChange={(e) => setMarks(e.target.value)} required />
                </div>
                <button className="btn btn-primary w-100">Add Question</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
