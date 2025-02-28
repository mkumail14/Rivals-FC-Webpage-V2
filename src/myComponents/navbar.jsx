import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; 
import "../css/navStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faX, faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.jpg";
import { getAuth, onAuthStateChanged,signOut  } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc,setDoc, Timestamp  } from "firebase/firestore";

import Swal from "sweetalert2";

import firebaseConfig from "./firebaseConfig";  
localStorage.setItem("mode","dark-mode");
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const auth = getAuth(app);
const db = getFirestore(app);
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // ✅ This makes the component reactive to route changes

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode === "dark-mode") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);


async function saveReview(newReview) {
  try {
  let reviews=[];
  const docRef = doc(db, "Rivals-FC-V2", "rating");
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  reviews=docSnap.data().rating;
  reviews.push(newReview);
  await setDoc(doc(db, "Rivals-FC-V2", "rating"), {
    rating: reviews
  });
  localStorage.setItem("rivalsfc-reviews-status",true);
  Swal.fire("Thank you for rating!")
} 
  }catch (error) {
    Swal.fire("Error: ",error)
}

}
setTimeout(toggleReviewForm,60000)
async function toggleReviewForm() {
  if(localStorage.getItem("rivalsfc-reviews-status")!="true"){
  const { value: formValues } = await Swal.fire({
    title: "Review",
    html: `
    <div class="reviewBox">
      <label>Would you like to review this site?</label>
      <div class="rate">
        <input type="radio" id="star5" name="rate" value="5" />
        <label for="star5" title="text">5 stars</label>
        <input type="radio" id="star4" name="rate" value="4" />
        <label for="star4" title="text">4 stars</label>
        <input type="radio" id="star3" name="rate" value="3" />
        <label for="star3" title="text">3 stars</label>
        <input type="radio" id="star2" name="rate" value="2" />
        <label for="star2" title="text">2 stars</label>
        <input type="radio" id="star1" name="rate" value="1" />
        <label for="star1" title="text">1 star</label>
      </div>
      <input id="swal-input2" class="swal2-input" placeholder="Add your comments">
    </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: 'green',
    confirmButtonText: "Submit",
    cancelButtonText:"Later",
    preConfirm: () => {
      return {
        rating: document.querySelector('input[name="rate"]:checked')?.value || "No rating",
        comment: document.getElementById("swal-input2").value || "No comments"
      };
    },
    preDeny:()=>{
      console.log("Set to Later!")
    }
  });

  if (formValues) {
    if(formValues.rating==="No rating"){
      Swal.fire(`Failed to submit empty form!`);
      return;
    }
    let newReview={
      comments:formValues.comment,
      rating:formValues.rating,
      time:Timestamp.now()
    }
    saveReview(newReview);
  }
}
}
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.body.classList.toggle("dark", newMode);
      localStorage.setItem("mode", newMode ? "dark-mode" : "light-mode");
      return newMode;
    });
  };
function logout(){
  try {
    let timerInterval;
    Swal.fire({
      title: "Loging Out!",
      html: "I will close in <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
     
    });
  } catch (error) {
    alert(error)
  }

  
  
}

  return (
    <nav className={sidebarOpen ? "active" : ""}>
      <div className="nav-bar">
        <FontAwesomeIcon icon={faBars} className="bx bx-menu sidebarOpen" onClick={() => setSidebarOpen(true)} />

        <img src={logo} onClick={()=>{window.location.href="/"}} alt="Logo" className="navbarLogo" />

        <span className="logo navLogo">
          <Link to="/">Rivals-FC</Link>
        </span>

        <div className={`menu ${sidebarOpen ? "active" : ""}`}>
          <div className="logo-toggle">
            <span className="logo togglelogo">
              <img src={logo} alt="Logo" className="navbarLogo1" />
            </span>
            <FontAwesomeIcon icon={faX} style={{ color: "#fcfcfc" }} onClick={() => setSidebarOpen(false)} />
          </div>

          <ul className="nav-links">
            <li><Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link></li>
            <li><Link to="/gallery" onClick={() => setSidebarOpen(false)}>Gallery</Link></li>
            <li><Link to="/players" onClick={() => setSidebarOpen(false)}>Players</Link></li>
            <li><Link to="/matches" onClick={() => setSidebarOpen(false)}>Matches</Link></li>
            <li><Link to="/contact" onClick={() => setSidebarOpen(false)}>Contact</Link></li>

            <li>
              {location.pathname === "/adminportal" ? (
                <Link  onClick={()=>{logout()}}>
                  <FontAwesomeIcon icon={faRightFromBracket} className="logout-icon" />
                </Link>
              ) : (
                <Link to="/admin" onClick={() => setSidebarOpen(false)}>Admin</Link>
              )}
            </li>
          </ul>
        </div>

        <div className="darkLight">
         
          <div className="dark-light" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
