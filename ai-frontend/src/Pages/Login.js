import React from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

function Login() {
  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">Login</h2>

        <div className="row justify-content-center">

          <div className="col-md-5">

            <div className="card p-4 shadow">

              <Link to="/student-login" className="btn btn-primary mb-3">
                Student Login
              </Link>

              <Link to="/admin-login" className="btn btn-outline-primary">
                Admin Login
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;