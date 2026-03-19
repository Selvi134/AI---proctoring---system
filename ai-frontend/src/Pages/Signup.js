import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ADDED
import Navbar from "../Components/Navbar";
import StudentFaceCamera from "../Components/StudentFaceCamera";
import { generateStudentId } from "../utils/generateStudentId";

function Signup() {

  const [role, setRole] = useState("");
  const [capturedImage, setCapturedImage] = useState("");

  const navigate = useNavigate();   // ADDED

  // Add this function
  const handleSignup = (e) => {
    e.preventDefault();

    if(role === "student"){
      if (!capturedImage) {
        alert("Please wait for your face to be captured.");
        return;
      }

      const studentId = generateStudentId();

      // ADDED: get email and password
      const emailValue = document.querySelector('input[type="email"]').value;
      const passwordValue = document.querySelector('input[type="password"]').value;
      const nameValue = document.querySelector('input[type="text"]').value;
      const examCodeValue = document.querySelector('input[placeholder="Exam Code"]').value;

      // ADDED: save account locally
      localStorage.setItem("studentAccount", JSON.stringify({
        studentId: studentId,
        email: emailValue,
        password: passwordValue,
        exam_code: examCodeValue
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
      fetch("http://localhost:8000/signup", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          student_id: studentId,
          password: passwordValue,
          image: capturedImage,
          exam_code: examCodeValue
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
      fetch("http://localhost:8000/send-student-id", {

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

    } else if (role === "admin") {
      const emailValue = document.querySelector('input[type="email"]').value;
      const passwordValue = document.querySelector('input[type="password"]').value;
      const nameValue = document.querySelector('input[type="text"]').value;

      fetch("http://localhost:8000/admin-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          password: passwordValue
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.admin_id) {
            alert(
              "Admin Signup Successful!\n\nYour Admin ID: " +
              data.admin_id +
              "\n\nPlease use this ID to login."
            );
            navigate("/admin-login");
        } else {
            alert("Error: " + data.detail);
        }
      })
      .catch(err => {
        console.error("Admin Signup API error", err);
        alert("Failed to sign up admin");
      });
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
                <label className="form-label">Exam Code</label>
                <input type="text" className="form-control" placeholder="Exam Code"/>
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

              {role === "student" && <StudentFaceCamera onCapture={setCapturedImage} />}

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