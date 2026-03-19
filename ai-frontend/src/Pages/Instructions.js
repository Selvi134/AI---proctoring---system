import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExamCamera from "../Components/ExamCamera";
import "../styles/instruction.css";
// import Navbar from "../Components/Navbar";  

function Instructions() {

  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [enableButton, setEnableButton] = useState(false);

  const studentId = localStorage.getItem("studentId") || "STU-XXXX";

  useEffect(() => {

    if (timeLeft === 0) {
      setEnableButton(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [timeLeft]);

  return (

    <div>

      {/* Navbar removed on instruction page */}
      {/* <Navbar /> */}

      <div className="instruction-container container mt-5">

        <div className="d-flex justify-content-between">

          <h5 className="welcome">
            Welcome : {studentId}
          </h5>

          <h5 className="timer">
            Time : {timeLeft}s
          </h5>

        </div>

        <div className="card shadow p-4 mt-3">

          <h3 className="text-center mb-4">
            Exam Instructions
          </h3>

          <ul className="instruction-list">

            <li>Read all questions carefully before answering.</li>

            <li>Do not switch browser tabs during the exam.</li>

            <li>Your camera will monitor your activity.</li>

            <li>Any suspicious activity will be recorded.</li>

            <li>Ensure proper lighting and face visibility.</li>

            <li>Exam will automatically submit on time completion.</li>

          </ul>

          <div className="text-center mt-4">

            <button
              className="btn btn-primary"
              disabled={!enableButton}
              onClick={() => navigate("/take-exam")}
            >
              Start Exam
            </button>

          </div>

        </div>

      </div>

      <ExamCamera />

    </div>

  );
}
export default Instructions;