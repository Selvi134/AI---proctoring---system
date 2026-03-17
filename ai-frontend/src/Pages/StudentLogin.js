import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import Navbar from "../Components/Navbar";
import StudentFaceCamera from "../Components/StudentFaceCamera";

function StudentLogin() {

  const navigate = useNavigate();                 
  const [studentId, setStudentId] = useState(""); 
  const [password, setPassword] = useState("");   

  // ADDED FUNCTION
  const handleLogin = (e) => {
    e.preventDefault();

    // ADDED: get stored account
    const storedAccount = JSON.parse(localStorage.getItem("studentAccount"));

    // --------------------------------------
    // NEW: CHECK LOGIN FROM BACKEND DATABASE
    // --------------------------------------
    fetch("http://127.0.0.1:8000/student-login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        student_id: studentId,
        password: password
      })

    })
    .then(res => {

      if(!res.ok){
        throw new Error("Invalid login");
      }

      return res.json();

    })
    .then(data => {

      // store student id
      localStorage.setItem("studentId", studentId);

      // redirect to instruction page
      navigate("/instructions");

    })
    .catch(err => {

      // fallback to your existing localStorage logic

      if(!storedAccount){
        alert("Account not found. Please Sign Up.");
        navigate("/signup");
        return;
      }

      // ADDED: check student id and password
      if(studentId === storedAccount.studentId && password === storedAccount.password){

        // store student id
        localStorage.setItem("studentId", studentId);

        // redirect to instruction page
        navigate("/instructions");

      }else{

        alert("Invalid Student ID or Password. Please Sign Up.");
        navigate("/signup");

      }

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

              <StudentFaceCamera />

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