import React, { useState, useEffect } from "react";
import "../css/players.css";
import Loader from "./loader";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import pp from '../assets/emptypp.jpg'
import nullpp from '../assets/emptypp.jpg'
import firebaseConfig from "./firebaseConfig";  
import Swal from "sweetalert2";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function Players() {
  const [allData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const docRef = doc(db, "Rivals-FC-V2", "allPlayers");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const playersArray = docSnap.data().allPlayers || []; // ✅ Correct key used
      setData(playersArray);
      console.log("Players Data Loaded!", playersArray);
    } else {
      console.log("Failed to load Data from Firestore!");
    }
    setLoading(false);
  }

  return (
    <div className="playerBody">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h1>Our Players</h1>
          <div className="playersGrid">
            {allData.length > 0 ? (
              allData.map((player, index) => (
                <article className="card" key={index}>
                  <img
                    className="card__background"
                    src={player.pp || nullpp}
                    onError={(e) => e.target.src = pp} 
                    alt={player.Name}
                    width="1920"
                    height="2193"
                  />
                  <div className="card__content flow">
                    <div className="card__content--container flow">
                      <h3 className="card__title">{player.Name}</h3>
                      <p className="card__description">
                        Position: {player.Position} <br />
                        Goals Scored: {player.Goal_Scored} <br />
                        Since: {player.Since}<br/>
                        Apperences: {player.app}
                      </p>
                    </div>
                    <button onClick={()=>{
 Swal.fire({
        icon: "error",
        title: "Blocked: Error 404!",
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
                    }} className="card__button">View Profile</button>
                  </div>
                </article>
              ))
            ) : (
              <p>No players available</p>
            )}
          </div>
        </div>
      )}
          <br/><br/><br/><br/><br/><br/>
      
    </div>
  );
}

export default Players;
