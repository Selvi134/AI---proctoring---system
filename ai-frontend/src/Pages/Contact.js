import React from "react";
import Navbar from "../Components/Navbar";

function Contact() {
  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center mb-4">
          Contact Us
        </h1>

        <div className="row justify-content-center">

          <div className="col-md-6">

            <form className="card p-4 shadow">

              <div className="mb-3">

                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Message
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter your message"
                ></textarea>

              </div>

              <button className="btn btn-primary">
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Contact;