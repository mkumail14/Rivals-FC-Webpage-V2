import React, { useState, useEffect } from "react";
import "../css/admin.css";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Swal from 'sweetalert2'
import firebaseConfig from "./firebaseConfig";  
import rivalsLogo from "../assets/logo.jpg"

// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get authentication instance
const auth = getAuth(app);
const db = getFirestore(app);

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const isAdminCheck = await isUserAdmin(user.email);
          if(isAdminCheck){
            console.log("Autorized!,Redirecting to Admin Portal")
            window.location.href='/adminportal'
          }
        }
      });
    };

    checkUser();
   
   
  }, []);

  async function isUserAdmin(mail) {
    try {
      const docRef = doc(db, "Rivals-FC-V2", "adminIDs");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const adminList = docSnap.data().adminIDs || [];
        return adminList.includes(mail);
      } else {
        console.error("Admin list not found!");
        return false;
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      return false;
    }
  }
  async function getAdminData(mail) {
    try {
      const docRef = doc(db, "Rivals-FC-V2", "adminIDs");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const adminList = docSnap.data().adminIDs || [];
        const isAdminCheck = adminList.includes(mail);

        setisAdmin(isAdminCheck);

        if (isAdminCheck) {
			window.location.href = "/adminportal";

        } else {
			Swal.fire({
				title: "Only Admin",
				text: "The user is not registered as admin!",
				icon: "info"
			  });
        }
      } 
    } catch (error) {
      console.error("Error fetching admin data:", error);
	  Swal.fire({
		title: "Try again later!",
		text: error,
		icon: "error"
	  });
    }
  }

  function submitForm(event) {
    event.preventDefault(); 

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        getAdminData(userCredential.user.email);
      })
      .catch((error) => {
        console.error("Login Error:", error.code, error.message);
		Swal.fire({
			title: "Login Error",
			text: error.message,
			icon: "error"
		  });
      });
  }

  return (
    <div className="adminLoginBox">
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <img src={rivalsLogo} className="logoRegister"></img>
            <form onSubmit={submitForm} className="login">
              <div className="login__field">
                <i className="login__icon fas fa-user"></i>
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  className="login__input"
                  placeholder="Email"
                />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-lock"></i>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="login__input"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="button login__submit">
                <span className="button__text">Log In Now</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            </form>
            <div className="social-login">
              <h3>
                <a href="/register">Register as Admin</a>
              </h3>
            </div>
          </div>
          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4"></span>
            <span className="screen__background__shape screen__background__shape3"></span>
            <span className="screen__background__shape screen__background__shape2"></span>
            <span className="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
