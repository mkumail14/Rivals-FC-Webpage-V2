import React, { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Loader from "./loader";
import "../css/home.css";
import ContactBox from "./contact"
import nullpp from "../assets/emptypp.jpg";

const firebaseConfig = {
  apiKey: "AIzaSyDdPmw7EHBU-AwoQ1szeW7WtHANaF30Q0",
  authDomain: "xo-game-c2506.firebaseapp.com",
  projectId: "xo-game-c2506",
  storageBucket: "xo-game-c2506.appspot.com",
  messagingSenderId: "1003496744924",
  appId: "1:1003496744924:web:34f59f5e9df9d261831119",
  measurementId: "G-701HCZH6H9",
};

// Initialize Firebase
let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

function Home() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [allPlayers, setAllPlayers] = useState([]);
  const [specialPlayers, setSpecialPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]); // ✅ Runs only when images are loaded

  async function loadData() {
    try {
      setLoading(true);
      console.log("⏳ Fetching data...");

      const aboutRef = doc(db, "Rivals-FC-V2", "aboutContent");
      const playersRef = doc(db, "Rivals-FC-V2", "allPlayers");
      const specialPlayersRef = doc(db, "Rivals-FC-V2", "specialPlayerData");
      const matchesRef = doc(db, "Rivals-FC-V2", "allMatches");
      const slideRef = doc(db, "Rivals-FC-V2", "slideShowImages");

      const aboutSnap = await getDoc(aboutRef);
      const playersSnap = await getDoc(playersRef);
      const specialPlayersSnap = await getDoc(specialPlayersRef);
      const matchesSnap = await getDoc(matchesRef);
      const slideSnap = await getDoc(slideRef);

      if (aboutSnap.exists()) setAboutData(aboutSnap.data().aboutContent);
      if (playersSnap.exists()) setAllPlayers(playersSnap.data().allPlayers || []);
      if (specialPlayersSnap.exists()) setSpecialPlayers(specialPlayersSnap.data().players || []);
      if (matchesSnap.exists()) setMatches(matchesSnap.data().allMatches || []);
      if (slideSnap.exists()) {
        setImages(slideSnap.data().data || []); // ✅ Corrected
        console.log("📸 Slide Images:", slideSnap.data().data);
      }

      console.log("✅ Data loaded successfully!");
      setLoading(false);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      setLoading(false);
    }
  }

  return (
    <div className="homebody" style={{ marginTop: "75px" }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* About Section */}
          <div className="firstPart">
            <div className="aboutBox">
              <h1>Welcome to Rivals FC</h1>
              <h3>The Ultimate Football Experience</h3>
              <p>{aboutData}</p>
            </div>
            <div className="slideshow-container">
              {images.length > 0 ? (
                <img src={images[currentImage]} alt="Team" className="slide" />
              ) : (
                <p>No images available</p>
              )}
              <div className="slideshow-dots">
                {images.map((_, index) => (
                  <span key={index} className={index === currentImage ? "dot active" : "dot"}></span>
                ))}
              </div>
            </div>
          </div>

          {/* Player of the Month Section */}
          <div className="secondPart">
            <h2 className="homeH2">PLAYER OF THE MONTH</h2>
            <div className="playersGrid">
              {allPlayers.length > 0 ? (
                allPlayers
                  .filter((player) => specialPlayers.includes(player.Name))
                  .map((player, index) => (
                    <article className="card" key={index}>
                      <img
                        className="card__background"
                        src={player.pp ? player.pp : nullpp}
                        alt={player.Name}
                        width="1920"
                        height="2193"
                      />
                      <div className="card__content flow">
                        <h2 className="card__title">{player.Name}</h2>
                        <p className="card__description">
                          <h3>{player.Position}</h3>
                          <br />
                        </p>
                      </div>
                      {/* <button className="card__button">View Profile</button> */}
                    </article>
                  ))
              ) : (
                <p>No special players available</p>
              )}
            </div>
          </div>
          <button onClick={() => (window.location.href = "/players")} className="btns homebtn" style={{ width: "fit-content" }}>
            View More
          </button>

          {/* Recent Matches */}
          <div className="thirdPart">
            <h2 className="homeH2">Recent Matches</h2>
            <div className="matchesGrid homeMatch">
              {matches.length > 0 ? (
                matches.slice(0, 3).map((match, index) => (
                  <div className={`matchCard ${match.Status.toLowerCase()}`} key={index}>
                    <h2>Rivals Vs {match.Team}</h2>
                    <p>
                      <strong>Date:</strong> {match.Date}
                    </p>
                    <p>
                      <strong>Location:</strong> {match.Location}
                    </p>
                    <p>
                      <strong>Score:</strong> {match.Ours}-{match.Opps}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`status ${match.Status.toLowerCase()}`}>{match.Status}</span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No matches available</p>
              )}
            </div>
          </div>
          <button onClick={() => (window.location.href = "/matches")} className="btns homebtn" style={{ width: "fit-content" }}>
            View More Matches
          </button>

          {/* Recent Posts */}
          <div className="forthPart">
            <h2 className="homeH2">Recent Posts</h2>
            <div className="slideshow-container">
              {images.length > 0 ? (
                <img src={images[currentImage]} alt="Team" className="slide" />
              ) : (
                <p>No images available</p>
              )}
              <div className="slideshow-dots">
                {images.map((_, index) => (
                  <span key={index} className={index === currentImage ? "dot active" : "dot"}></span>
                ))}
              </div>
            </div>
            <br />
            <button className="btns homebtn" onClick={() => (window.location.href = "/gallery")}>
              View More
            </button>
          </div>
          <div className="fifthPart">
          <h2 className="homeH2">Contact Us</h2>
          <ContactBox/>
          </div>
          
        </>
      )}
    </div>
  );
}

export default Home;
