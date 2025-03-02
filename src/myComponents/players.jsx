import React, { useState, useEffect } from "react";
import "../css/players.css";
import Loader from "./loader";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc,setDoc, Timestamp } from "firebase/firestore";
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
    } else {
      console.log("Failed to load Data from Firestore!");
    }
    setLoading(false);
  }


  async function loadPlayersReview(index) {
    try {
      const docRef = doc(db, "Rivals-FC-V2", "playersReviews");
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        console.log("No players review data found!");
        return null;
      }
  
      const playerName = allData[index].Name; 
  
      if (!playerName) {
        console.log("No name found for the given index!");
        return null;
      }
  
      return docSnap.data()[playerName] ?? [];
    } catch (error) {
      console.error("Error fetching player review:", error);
      return null;
    }
  }
  
  

  function timeAgo(timestamp) {
    if (!timestamp || isNaN(timestamp)) return "Unknown time"; // Handle invalid timestamps

    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
}

  









  async function viewReviews(id) {
    let playerReviews = await loadPlayersReview(id);
  
    Swal.fire({
      title: `${allData[id].Name}'s Reviews`,
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="reviewerName" type="text"  placeholder="Anonymous..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
          <input id="newReview" type="text" placeholder="Write a review..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
          <button id="postReview" class="btns" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Post</button>
        </div>
        <div id="previousComments" style="margin-top: 15px; max-height: 300px; overflow-y: auto; border-top: 1px solid #ddd; padding-top: 10px;"></div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      showCloseButton: true,
      width: "600px",
      didOpen: () => {
        const container = document.getElementById("previousComments");
        const reviewerInput = document.getElementById("reviewerName");
        const reviewInput = document.getElementById("newReview");
        const postButton = document.getElementById("postReview");
  
        // Show "No reviews yet" if empty
        if (!playerReviews || playerReviews.length === 0) {
          container.innerHTML = "<p style='color: gray;'>No reviews yet.</p>";
        } else {
          playerReviews.forEach((review) => {
            const box = document.createElement("div");
            let data = review.split("$");
            const reviewer = data[0] || "Anonymous";
            const comment = data[1] || "No comment";
            const posted = data[2] ? timeAgo(data[2]) : "Unknown time";
  
            box.innerHTML = `
              <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 8px; border: 1px solid #ddd;">
                <p style="margin: 0; font-size: 14px;"><strong>${reviewer}:</strong> ${comment}</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: gray;">${posted}</p>
              </div>
            `;
            container.appendChild(box);
          });
        }
  
        // Handle Post Button Click
        postButton.addEventListener("click", async () => {
          const reviewerName = reviewerInput.value.trim() || "Anonymous";
          const newComment = reviewInput.value.trim();
          if (!newComment) return;
  
          const timestamp = Date.now();
          const newEntry = `${reviewerName}$${newComment}$${timestamp}`;
  
          // Append new comment instantly
          const newBox = document.createElement("div");
          newBox.innerHTML = `
            <div style="background: #d4edda; padding: 10px; border-radius: 5px; margin-bottom: 8px; border: 1px solid #c3e6cb;">
              <p style="margin: 0; font-size: 14px;"><strong>${reviewerName}:</strong> ${newComment}</p>
              <p style="margin: 2px 0 0; font-size: 12px; color: gray;">${timeAgo(timestamp)}</p>
            </div>
          `;
          container.prepend(newBox);
  
          // Clear input fields
          reviewInput.value = "";
          saveReview(allData[id].Name,playerReviews,newEntry);
  
        });
      },
    });
  }

  async function saveReview(Name,reviews,newReview){
    reviews.push(newReview)
     await setDoc(doc(db, "Rivals-FC-V2", "playersReviews"), {
        [Name]: reviews
      }, { merge: true });

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
                    <button onClick={()=>{viewReviews(index)}} className="card__button">View Reviews</button>
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
