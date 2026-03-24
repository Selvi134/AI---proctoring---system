import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import Navbar from "../Components/Navbar";
import StudentFaceCamera from "../Components/StudentFaceCamera";

function StudentLogin() {

  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [examCode, setExamCode] = useState("");

  // ADDED FUNCTION
  const handleLogin = (e) => {
    e.preventDefault();

    // --------------------------------------
    // NEW: CHECK LOGIN FROM BACKEND DATABASE
    // --------------------------------------
    fetch("http://localhost:8000/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        student_id: studentId,
        password: password,
        exam_code: examCode.trim()
      })

    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(`Server error: ${res.status} ${text}`);
        });
      }
      return res.json();
    })
    .then(data => {
      
      if (data.status === "success") {
        // store student id
        localStorage.setItem("studentId", studentId);
        localStorage.setItem("examCode", examCode);
        // redirect to instruction page
        navigate("/instructions");
      } else if (data.status === "student_not_found") {
        alert("Student Not Found");
      } else if (data.status === "wrong_password") {
        alert("Wrong Password");
      } else if (data.status === "face_not_match") {
        alert("Face Does Not Match");
      } else if (data.status === "face_error") {
        alert("Error analyzing face");
      } else if (data.status === "invalid_exam_code") {
        alert("Invalid Exam Code. Please check the code and try again.");
      } else {
        alert("Invalid login details");
      }

    })
    .catch(err => {
      console.error("Login component error:", err);
      alert("Error connecting to server for login. Please ensure the backend is running.");
    });

  };

  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">
          Student Login
        </h2>

        <div className="row justify-content-center">

          <div className="col-md-5">

            {/* ADDED onSubmit */}
            <form className="card p-4 shadow" onSubmit={handleLogin}>

              <div className="mb-3">
                <label className="form-label">
                  Student ID
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={studentId}                       
                  onChange={(e)=>setStudentId(e.target.value)}  
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  value={password}                        
                  onChange={(e)=>setPassword(e.target.value)}  
                />
              </div>


              <div className="mb-3">
                <label className="form-label">
                  Exam Code
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  placeholder="Enter Exam Code"
                />
              </div>

              <button className="btn btn-primary">
                Login
              </button>

              <div className="text-center mt-3">
                <a href="/student-forgot-password" className="text-decoration-none">
                  Forgot Password?
                </a>
              </div>

              <div className="text-center mt-2">
                <span>
                  Don't have an account?{" "}
                </span>

                <a href="/signup" className="text-decoration-none">
                  Sign Up
                </a>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>

  );
}

export default StudentLogin;