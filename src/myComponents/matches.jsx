import React, { useState, useEffect } from "react";
import "../css/matches.css";
import Loader from "./loader";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdPmw7EHBU-AwoDQ1szeW7WtHANaF30Q0",
  authDomain: "xo-game-c2506.firebaseapp.com",
  projectId: "xo-game-c2506",
  storageBucket: "xo-game-c2506.appspot.com",
  messagingSenderId: "1003496744924",
  appId: "1:1003496744924:web:34f59f5e9df9d261831119",
  measurementId: "G-701HCZH6H9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Matches() {
  const [allData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const docRef = doc(db, "Rivals-FC-V2", "allMatches");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const matchesArray = docSnap.data().allMatches || [];
        setData(matchesArray);
        console.log("Matches Data Loaded!", matchesArray);
      } else {
        console.log("No match data found!");
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="matchesBody">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h1>Rivals FC Matches</h1>
          <div className="matchesGrid">
            {allData.length > 0 ? (
              allData.map((match, index) => (
                <div className={`matchCard ${match.Status.toLowerCase()}`} key={index}>
                  <h2>Vs {match.Team}</h2>
                  <p><strong>Date:</strong> {match.Date}</p>
                  <p><strong>Location:</strong> {match.Location}</p>
                  <p><strong>Score:</strong> {match.Ours}-{match.Opps}</p>
                  <p><strong>Status:</strong> <span className={`status ${match.Status.toLowerCase()}`}>{match.Status}</span></p>
                  <p><strong>Players:</strong> {match.Players.join(", ")}</p>
                  <p><strong>Goal Scorer:</strong> {match.scorer.join(", ")}</p>

                </div>
              ))
            ) : (
              <p>No matches available</p>
            )}
          </div>
        </div>
      )}
          <br/><br/><br/><br/><br/><br/>
      
    </div>
  );
}
