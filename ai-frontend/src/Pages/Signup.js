import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ADDED
import Navbar from "../Components/Navbar";
import StudentFaceCamera from "../Components/StudentFaceCamera";
import { generateStudentId } from "../utils/generateStudentId";

function Signup() {

  const [role, setRole] = useState("");

  const navigate = useNavigate();   // ADDED

  // Add this function
  const handleSignup = (e) => {
    e.preventDefault();

    // ADDED: check if account already exists
    const existingAccount = localStorage.getItem("studentAccount");
    if(existingAccount){
      alert("Account already exists. Please login.");
      navigate("/student-login");
      return;
    }

    if(role === "student"){

      const studentId = generateStudentId();

      // ADDED: get email and password
      const emailValue = document.querySelector('input[type="email"]').value;
      const passwordValue = document.querySelector('input[type="password"]').value;
      const nameValue = document.querySelector('input[type="text"]').value;

      // ADDED: save account locally
      localStorage.setItem("studentAccount", JSON.stringify({
        studentId: studentId,
        email: emailValue,
        password: passwordValue
      }));

      // ADDED: store studentId for instruction page
      localStorage.setItem("studentId", studentId);

      alert(
        "Signup Successful!\n\nYour Student ID: " +
        studentId +
        "\n\nThis ID will be sent to your email."
      );

      // ------------------------------
      // NEW: SAVE DATA IN BACKEND
      // ------------------------------
      fetch("http://127.0.0.1:8000/signup", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          student_id: studentId,
          password: passwordValue
        })

      })
      .then(res => res.json())
      .then(data => {
        console.log("Student saved in database", data);
      })
      .catch(err => {
        console.error("Signup API error", err);
      });

      // ADDED EMAIL API CALL
      fetch("http://127.0.0.1:8000/send-student-id", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: document.querySelector('input[type="email"]').value,
          student_id: studentId
        })

      });

      // ADDED: navigate to instruction page
      navigate("/instructions");

    } else {

      alert("Admin Signup Successful");

    }
  };

  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">
          Create Account
        </h2>

        <div className="row justify-content-center">

          <div className="col-md-6">

            {/* attach handler here */}
            <form className="card p-4 shadow" onSubmit={handleSignup}>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control"/>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control"/>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control"/>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control"/>
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {role === "student" && <StudentFaceCamera />}

              <button className="btn btn-primary">
                Sign Up
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>

  );
}
export default Signup;