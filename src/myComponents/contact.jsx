import React, { useState, useEffect } from "react";
import "../css/contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"; 
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; 

import firebaseConfig from "./firebaseConfig";  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Contact() {
  const [result, setResult] = useState("");
  const [requests, setRequests] = useState([]);

  // Fetch match requests from Firestore once when component mounts
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "Rivals-FC-V2", "matchRequest");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRequests(docSnap.data().matchRequest || []);
      }
    }
    fetchData();
  }, []);

  // Update Firestore with new request
  async function updateData(newRequest) { 
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);

    await setDoc(doc(db, "Rivals-FC-V2", "matchRequest"), {
      matchRequest: updatedRequests
    });

    console.log("Data Updated:", updatedRequests);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "0d8e58e4-45e6-4a4f-96de-8244474ed224");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      const matchDetails = {
        name: formData.get("name"),
        teamName: formData.get("teamName"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        date: new Date().toISOString()
      };
      
      updateData(matchDetails);
      setResult("Form Submitted Successfully ✅");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="contactBody">
      <div className="secondSection">
        <h2 style={{color:"black"}}>Schedule a Match</h2>
        <form onSubmit={onSubmit} className="contactForm">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="text" name="teamName" placeholder="Your Team Name" required />
          <input type="tel" name="phone" placeholder="Your Phone Number" required />
          <textarea name="message" placeholder="Write your preferred date, time, and location." required></textarea>
          <button type="submit">Submit Request</button>
        </form>
        <span className="resultMessage">{result}</span>

        <div className="firstSection">
          <h4>Contact Directly to Captain</h4>
          <div className="icons">
            <a href="tel:+923363545747">
              <FontAwesomeIcon icon={faPhoneVolume} className="icon phone" />
            </a>
            <a href="https://wa.me/923363545747?text=Hello%20Rivals%20Captain,%20I%20need%20to%20schedule%20a%20match" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} className="icon whatsapp" />
            </a>
          </div>
        </div>
      </div>
          <br/><br/><br/><br/><br/><br/>
      
    </div>
  );
}
