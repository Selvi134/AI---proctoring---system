import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function AdminLogin() {

  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  // ADDED LOGIN FUNCTION
  const handleLogin = (e) => {

    e.preventDefault();

    fetch("http://localhost:8000/admin-login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        admin_id: adminId,
        password: password
      })

    })
    .then(res => {

      if(!res.ok){
        throw new Error("Invalid credentials");
      }

      return res.json();

    })
    .then(data => {

      alert("Admin Login Successful");
      localStorage.setItem("adminId", adminId);
      navigate("/admin-dashboard");

    })
    .catch(err => {

      alert("Invalid Admin ID or Password");

    });

  };

  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">
          Admin Login
        </h2>

        <div className="row justify-content-center">

          <div className="col-md-5">

            {/* ADDED onSubmit */}
            <form className="card p-4 shadow" onSubmit={handleLogin}>

              <div className="mb-3">

                <label className="form-label">
                  Admin ID
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={adminId}
                  onChange={(e)=>setAdminId(e.target.value)}
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

              <button className="btn btn-primary">
                Login
              </button>

              <div className="text-center mt-3">
                <a href="/admin-forgot-password" className="text-decoration-none">
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

export default AdminLogin;