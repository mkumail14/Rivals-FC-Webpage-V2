import React, { useState } from "react";
import "../css/register.css";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";  


// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

const Register = () => {
  const [result, setResult] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");

    // Wait for the user to input a password before proceeding
    const pass = await takePass();
    if (!pass) {
      Swal.fire("Error! Failed to register");
      setResult("FAILED TO REGISTER!");
      return;
      
    }

    try {
      // Firebase Registration
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);

      // Submit the form data
      await submitForm(event);
      setResult("Form Submitted Successfully");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
        });
        Toast.fire({
        icon: "success",
        title: "Request submitted succesfully"
        });
      event.target.reset();
      
    } catch (error) {
      console.error("Error", error.code);
      setResult(error.message);
      Swal.fire({
        title: "Weak Password!",
        icon: "Error",
        
      });
    }
  };

  async function takePass() {
    const { value: password } = await Swal.fire({
      title: "Create a password",
      input: "password",
      inputLabel: "Remember your password for future.",
      inputPlaceholder: "Create a password",
      inputAttributes: {
        maxlength: "20",
        autocapitalize: "off",
        autocorrect: "off",
      },
    });

    return password || null;
  }

  async function submitForm(event) {
    const formData = new FormData(event.target);
    formData.append("access_key", "0d8e58e4-45e6-4a4f-96de-8244474ed224");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Error", data);
      setResult(data.message);
    }
  }

  return (
    <div className="registerBody">
      <div className="form-container">
        <h2 style={{ color: "black" }}>Register as Admin</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea name="message" required></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  );
};

export default Register;
