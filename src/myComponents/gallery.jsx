import React, { useState, useEffect } from "react";
import "../css/gallery.css";
import Loader from "./loader";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase Config (Move to .env file in production)
const firebaseConfig = {
  apiKey: "AIzaSyDdPmw7EHBU-AwoDQ1szeW7WtHANaF30Q0",
  authDomain: "xo-game-c2506.firebaseapp.com",
  projectId: "xo-game-c2506",
  storageBucket: "xo-game-c2506.appspot.com",
  messagingSenderId: "1003496744924",
  appId: "1:1003496744924:web:34f59f5e9df9d261831119",
  measurementId: "G-701HCZH6H9",
};

// Prevent duplicate initialization
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Gallery() {
  const [allData, setData] = useState({ allImages: [] }); // Ensuring it always has a default structure
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const docRef = doc(db, "Rivals-FC-V2", "allImages");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const imgData = docSnap.data() || { allImages: [] }; // Ensure valid structure
        setData(imgData);
        console.log("Images Data Loaded!", imgData);
      } else {
        console.log("No image data found!");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="galleryBody">
          <h1>The Best of Rivals</h1>
          <div className="grid-container">
            {(() => {
              let items = [];
              if (allData?.allImages?.length > 0) {
                for (let i = 0; i < allData.allImages.length; i++) {
                  const item = allData.allImages[i];
                  if (item.type === "image") {
                    items.push(
                      <div key={i} className="grid-item">
                        <img src={item.URL} alt={`Rivals Image ${i + 1}`} />
                        <p className="cardText">{item.des}</p>
                      </div>
                    );
                  } else if (item.type === "video") {
                    items.push(
                      <div key={i} className="grid-item">
                        <video className="vidPlayer" controls>
                          <source src={item.URL} type="video/mp4" />
                        </video>
                        <p className="cardText">{item.des}</p>
                      </div>
                    );
                  }
                }
              } else {
                items.push(<p key="no-images">No images available</p>);
              }
              return items;
            })()}
          </div>
              <br/><br/><br/><br/><br/><br/>
          
        </div>
        
      )}
    </>
  );
}
