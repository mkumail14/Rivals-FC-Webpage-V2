import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import '../css/adminPortal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faPen } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Loader from './loader'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import nullpp from '../assets/emptypp.jpg'

const firebaseConfig = {
  apiKey: "AIzaSyDdPmw7EHBU-AwoDQ1szeW7WtHANaF30Q0",
  authDomain: "xo-game-c2506.firebaseapp.com",
  projectId: "xo-game-c2506",
  storageBucket: "xo-game-c2506.appspot.com",
  messagingSenderId: "1003496744924",
  appId: "1:1003496744924:web:34f59f5e9df9d261831119",
  measurementId: "G-701HCZH6H9",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const auth = getAuth(app);
const db = getFirestore(app);

export default function AdminPortal() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminLists, setAdminLists] = useState([]);
  const [addEmailInput, setaddEmailInput] = useState("");
  const [playersList, setplayersList] = useState([]);
  const [galleryList, setgalleryList] = useState([]);
  const [matchesList, setmatchesList] = useState([]);
  const [matchRequest, setmatchRequest] = useState([]);
  const [siteReviews, setsiteReviews] = useState([]);
  const [aboutMeData, setAboutMeData] = useState(null);
  const [slideImg, setslideImg] = useState([]);





  useEffect(() => {  
    loadAllData()
  },[4])
  useEffect(() => {
    const checkUser = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.log("No user logged in. Redirecting...");
          window.location.href = "/";
          return;
        }

        const isAdminCheck = await isUserAdmin(user.email);
        setIsAdmin(isAdminCheck);
        setLoading(false);
      });
    };

    checkUser();
   
   
  }, []);
 
async function loadAllData() {
const docRef = doc(db, "Rivals-FC-V2", "allPlayers");
const docSnap = await getDoc(docRef);
const docRef1 = doc(db, "Rivals-FC-V2", "allImages");
const docSnap1 = await getDoc(docRef1);
const docRef2 = doc(db, "Rivals-FC-V2", "allMatches");
const docSnap2 = await getDoc(docRef2);
const docRef3 = doc(db, "Rivals-FC-V2", "matchRequest");
const docSnap3 = await getDoc(docRef3);
const docRef4 = doc(db, "Rivals-FC-V2", "rating");
const docSnap4 = await getDoc(docRef4);
const docRef5 = doc(db, "Rivals-FC-V2", "aboutContent");
const docSnap5 = await getDoc(docRef5);
const docRef6 = doc(db, "Rivals-FC-V2", "slideShowImages");
const docSnap6 = await getDoc(docRef6);

  setplayersList(docSnap.data().allPlayers)
  setgalleryList(docSnap1.data().allImages)
  setmatchesList(docSnap2.data().allMatches)
  setmatchRequest(docSnap3.data().matchRequest)
  setsiteReviews(docSnap4.data().rating)
  setAboutMeData(docSnap5.data().aboutContent)
  setslideImg(docSnap6.data().data)

}




async function editSlideImages(){



  

}




function refresh(){
  window.location.reload();
}
  async function isUserAdmin(mail) {
    try {
      const docRef = doc(db, "Rivals-FC-V2", "adminIDs");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const adminList = docSnap.data().adminIDs || [];
        setAdminLists(docSnap.data().adminIDs)
        return adminList.includes(mail);
      } else {
        console.log("Admin list not found!");
        return false;
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      return false;
    }
  }

  useEffect(() => {
    if (!loading && !isAdmin) {
      console.log("Not an admin. Redirecting...");
      window.location.href = "/";
    }
  }, [isAdmin, loading]);








  let adminListElement=[];
  for (let index = 0; index < adminLists.length; index++) {
    adminListElement.push(<div key={index}>{adminLists[index]} <FontAwesomeIcon onClick={() => deleteEmail(index)} icon={faTrash} style={{color: "#fa0505",}} /></div>);
  }



  let galleryElement = [];
  let matchesElement=[];
  let playerDetailsElement=[];
  let matchRequestElement=[]
  updateElement()
useEffect(()=>{
  updateElement()
},[playersList,galleryList,matchesList,matchRequest])





function updateElement() {
  galleryElement = [];
  matchesElement = [];
  playerDetailsElement = [];
  matchRequestElement = [];

  for (let i = 0; i < galleryList.length; i++) {
    let item = galleryList[i];
    let ttime = timeConverter(item.posted);
    if (item.type === "image" || item.type === "video") {
      galleryElement.push(
        <tr key={i}>
          <td>
            {item.type === "image" ? (
              <img
                className="apImg"
                style={{ width: "80px", borderRadius: "10px" }}
                src={item.URL || "/default-image.png"}
                alt="Gallery Image"
              />
            ) : (
              <video className="vidPlayer" controls>
                <source src={item.URL} type="video/mp4" />
              </video>
            )}
          </td>
          <td>{item.des || "No Description"}</td>
          <td>{ttime || "Unknown"}</td>
          <td>
            <FontAwesomeIcon onClick={() => deleteGalleryImage(i)} icon={faTrash} style={{ color: "#fa0505" }} />
          </td>
          <td>
            <FontAwesomeIcon onClick={() => editGalleryImage(i)} icon={faPen} style={{ color: "#00b3ff" }} />
          </td>
        </tr>
      );
    }
  }

  for (let index = 0; index < playersList.length; index++) {
    const player = playersList[index];
    playerDetailsElement.push(
      <tr key={index}>
        <td>
          <img
            className="apImg"
            style={{ width: "8vb", borderRadius: "50%" }}
            src={player.pp || nullpp}
            alt="Player"
          />
        </td>
        <td>{player.Name}</td>
        <td>{player.Position || "NA"}</td>
        <td>{player.Goal_Scored || "NA"}</td>
        <td>{player.Since || "NA"}</td>
        <td>{player.app || "NA"}</td>
        <td><FontAwesomeIcon onClick={() => editPlayer(index)} icon={faPen} style={{ color: "#00b3ff" }} /></td>   
        <td><FontAwesomeIcon onClick={() => deletePlayer(index)} icon={faTrash} style={{ color: "#fa0505" }} /></td> 
      </tr>
    );
  }

  for (let index = 0; index < matchRequest.length; index++) {
    const req = matchRequest[index];
    matchRequestElement.push(
      <tr key={index}>
        <td>{req.date}</td>
        <td>{req.teamName}</td>
        <td>{req.name}</td>
        <td>{req.phone}</td>
        <td>{req.message}</td>
      </tr>
    );
  }

  for (let index = 0; index < matchesList.length; index++) {
    const match = matchesList[index];
    let scoreElement = `${match.Ours}-${match.Opps}`;
    matchesElement.push(
      <tr key={index}>
        <td>{match.Date}</td>
        <td>{match.Team}</td>
        <td style={{ color: match.Status === "Lost" ? "red" : match.Status === "Won" ? "green" : "orange" }}>
          <strong>{match.Status}</strong>
        </td>
        <td>{scoreElement}</td>
        <td>{match.scorer?.join(', ') || "N/A"}</td>
        <td>{match.Players?.join(', ') || "N/A"}</td>
        <td>{match.Location}</td>
        <td><FontAwesomeIcon onClick={() => deleteMatch(index)} icon={faTrash} style={{ color: "#fa0505" }} /></td>
        <td><FontAwesomeIcon onClick={() => editMatch(index)} icon={faPen} style={{ color: "#00b3ff" }} /></td>
      </tr>
    );
  }
}













function showImageAlert() {
  if (slideImg.length === 0) {
    Swal.fire("No images available!", "", "warning");
    return;
  }

  Swal.fire({
    title: "Click on an Image to Delete!",
    html: `
      <div id="slideImagesContainer" style="max-height: 400px; overflow-y: auto;"></div>
      <input id="newSlideImg" type="file" style="display:block; margin-top:10px;" />
      <button id="addSlideImgBtn" class="btns" style="margin-top:5px;">Add</button>
    `,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    showCancelButton: true,  // ✅ This shows the cancel button
    showCloseButton: true,   // ✅ This allows closing with (X)
    width: "600px",
    didOpen: () => {
      const container = document.getElementById("slideImagesContainer");

      slideImg.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "slideImage";
        img.alt = "Slide Image";
        img.style = "width:100%; margin-bottom:10px; border-radius:10px; cursor:pointer;";
        img.onclick = () => delSlideImg(index);
        container.appendChild(img);
      });

      document.getElementById("addSlideImgBtn").addEventListener("click", addSlideImg);
    },
  }).then((result) => {
    if (result.isConfirmed) {  // ✅ This checks if "Save" was clicked
      saveSlidesToDB();
      Swal.fire("Slides Updated!", "", "success");
    }
  });
}





async function addSlideImg(){
  let File=document.getElementById("newSlideImg").files[0];
  if(File){
  let fileURL = await uploadFile(File); 
  let temp=slideImg;
  temp.push(fileURL)
  setslideImg(temp);
  showImageAlert();
  }

}


async function delSlideImg(index){
  if(slideImg.length>3){
  let temp=slideImg;
  temp.splice(index,1)
  setslideImg(temp);
  showImageAlert();
  }else{
    Swal.fire("There should be atleast 3 images!")
  }
}




async function addPlayer() {
  const { value: formValues } = await Swal.fire({
    title: "Add New Player",
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Player Name">
      <input id="swal-position" class="swal2-input" placeholder="Position">
      <input id="swal-goals" type="number" class="swal2-input" placeholder="Goals Scored">
      <input id="swal-since" type="number" class="swal2-input" placeholder="Since (Year)">
      <input id="swal-app" type="number" class="swal2-input" placeholder="Appearances">
      <label>Add Image(Optional)</label>
      <input style="width: 75%;" id="swal-img" class="swal2-input" type="file">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add Player",
    preConfirm: () => {
      
      return {
        Name: document.getElementById("swal-name").value,
        Position: document.getElementById("swal-position").value,
        Goal_Scored: document.getElementById("swal-goals").value,
        Since: document.getElementById("swal-since").value,
        app: document.getElementById("swal-app").value,
        file: document.getElementById("swal-img").files[0] // Correct way to get the file
      };
    }
  });

  if (formValues) {
    let fileURL = null;
    
    if (formValues.file) {
      fileURL = await uploadFile(formValues.file); // Wait for file upload
    }

    const newPlayer = {
      Name: formValues.Name,
      Position: formValues.Position,
      Goal_Scored: formValues.Goal_Scored,
      Since: formValues.Since,
      app: formValues.app,
      pp: fileURL // Store file URL
    };
if(newPlayer.Name=='' || newPlayer.Position==''|| formValues.Goal_Scored==''|| newPlayer.Since==''|| newPlayer.app=='' ){
  Swal.fire({
    title: "Null error",
    text: "No null input allowed!",
    icon: "error"
  });
  return
}
    let tempArr = [...playersList, newPlayer]; // Create a new array to trigger re-render
    setplayersList(tempArr);
    savePlayerListToDB(tempArr);

    console.log("Player Added:", newPlayer);
    Swal.fire("Player Added!", `${newPlayer.Name} has been added.`, "success");
  }
}


async function addMedia() {
  const { value: formValues } = await Swal.fire({
    title: "Add New Media",
    html: `
      <input id="swal-des" class="swal2-input" placeholder="Write Description">
      <br></br>
      <label>Add Media</label>
      <input style="width: 75%;" id="swal-img" class="swal2-input" type="file">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add Media",
    preConfirm: () => {
      const fileInput = document.getElementById("swal-img").files[0];

      if (!fileInput) {
        Swal.fire({
          title: "Failed",
          text: "No file selected!",
          icon: "error"
        });
        return;
      }

      let extension = fileInput.name.split('.').pop().toLowerCase();
      let typee;
      
      if (["jpg", "jpeg", "png"].includes(extension)) {
        typee = "image";
      } else if (extension === "mp4") {
        typee = "video";
      } else {
        Swal.fire({
          title: "Failed",
          text: "File type not supported!",
          icon: "error"
        });
        return;
      }

      return {
        des: document.getElementById("swal-des").value.trim(),
        posted: Timestamp.now(), // ✅ Corrected Timestamp Usage
        file: fileInput,
        type: typee
      };
    }
  });

  if (formValues) {
    let fileURL = null;

    if (formValues.file) {
      fileURL = await uploadFile(formValues.file); 
    }

    if (!formValues.des) {
      Swal.fire({
        title: "Null Error",
        text: "Description cannot be empty!",
        icon: "error"
      });
      return;
    }

    const newMedia = {
      des: formValues.des,
      posted: Timestamp.now(),
      URL: fileURL,
      type: formValues.type
    };

    let tempArr = [...galleryList, newMedia];
    setgalleryList(tempArr);
    saveGalleryListToDB(tempArr);

    console.log("Media Added:", newMedia);
    Swal.fire("Media Added!", "success");
  }
}






function addMatch() {
  Swal.fire({
    title: "Add Match",
    html: `
      <input id="opponent" class="swal2-input" placeholder="Opponent Team">
      <input id="ourScore" type="number" class="swal2-input" placeholder="Our Score">
      <input id="opponentScore" type="number" class="swal2-input" placeholder="Opponent Score">
      <input id="date" type="date" class="swal2-input">
      <input id="location" class="swal2-input" placeholder="Location">
      <h3>Select Players</h3>
      <div id="playersContainer" style="text-align:left; max-height: 150px; overflow-y: auto;"></div>
      <h3>Assign Goals</h3>
      <div id="goalsContainer" style="text-align:left;"></div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    didOpen: () => {
      const playersContainer = document.getElementById("playersContainer");
      const goalsContainer = document.getElementById("goalsContainer");

      playersList.forEach((player, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.marginBottom = "5px";

        const playerCheckbox = document.createElement("input");
        playerCheckbox.type = "checkbox";
        playerCheckbox.value = player.Name;
        playerCheckbox.id = `player-${index}`;
        playerCheckbox.style.marginRight = "5px";
        playerCheckbox.style.width = "50px";


        const label = document.createElement("label");
        label.innerText = player.Name;

        const goalInput = document.createElement("input");
        goalInput.type = "number";
        goalInput.placeholder = `Goals by ${player.Name}`;
        goalInput.className = "swal2-input";
        goalInput.style.display = "none";
        goalInput.id = `goal-${index}`;

        playerCheckbox.addEventListener("change", () => {
          goalInput.style.display = playerCheckbox.checked ? "inline-block" : "none";
        });

        wrapper.appendChild(playerCheckbox);
        wrapper.appendChild(label);
        playersContainer.appendChild(wrapper);
        goalsContainer.appendChild(goalInput);
      });
    },
    preConfirm: () => {
      const opponent = document.getElementById("opponent").value;
      const ourScore = document.getElementById("ourScore").value;
      const opponentScore = document.getElementById("opponentScore").value;
      const date = document.getElementById("date").value;
      const location = document.getElementById("location").value;

      if (!opponent || !ourScore || !opponentScore || !date || !location) {
        Swal.showValidationMessage("Please fill all required fields");
        return false;
      }

      const selectedPlayers = [];
      const goals = [];

      playersList.forEach((player, index) => {
        const playerCheckbox = document.getElementById(`player-${index}`);
        if (playerCheckbox.checked) {
          selectedPlayers.push(player.Name);
          const goalInput = document.getElementById(`goal-${index}`);
          const goalCount = goalInput ? parseInt(goalInput.value) || 0 : 0;

          for (let i = 0; i < goalCount; i++) {
            goals.push(player.Name);
          }
        }
      });

      return {
        opponent,
        ourScore,
        opponentScore,
        date,
        location,
        selectedPlayers,
        goals,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      let status
      if(result.value.ourScore==result.value.opponentScore){
        status="Draw"
      }else if(result.value.ourScore<result.value.opponentScore){
status="Lost"
      }else{
        status="Won"
      }
  
      let newMatch={
        Date:(result.value.date).toString(),
        Location:result.value.location,
        Opps:result.value.opponentScore,
        Ours:result.value.ourScore,
        Players:result.value.selectedPlayers,
        Status:status,
        Team:result.value.opponent,
        scorer:result.value.goals
      }

      let updatedMatchList=matchesList;
      updatedMatchList.push(newMatch);
      setmatchesList(updatedMatchList);
      increaseAppearances(result.value.selectedPlayers);
      increaseGoalScores(result.value.goals);
      saveMatchesListToDB(updatedMatchList)
      console.log("Match Data:", result.value);
      Swal.fire("Saved!", "Match has been added.", "success");
    }
  });
}

async function increaseAppearances(x) {
  if (x.length !== 0) {
    let updatedList = playersList; 

    for (let index = 0; index < x.length; index++) {
      let playerName = x[index];
      for (let index1 = 0; index1 < playersList.length; index1++) { 
        if (playerName === playersList[index1].Name) { 
          let newApp = Number(playersList[index1].app) + 1;
          updatedList[index1] = { 
           Goal_Scored:playersList[index1].Goal_Scored,
           Name:playersList[index1].Name,
           Position:playersList[index1].Position,
           Since:playersList[index1].Since,
           pp:playersList[index1].pp,
            app: newApp.toString()
          };

          console.log("Updating app:", updatedList[index1]);
          break; 
        }
      }
    }

    setplayersList(updatedList); 
    savePlayerListToDB(updatedList); 
  }
}


async function increaseGoalScores(goals) {
  if (goals.length !== 0) {
    const updatedPlayerList = playersList.map(player => {
      const goalCount = goals.filter(name => name === player.Name).length;
      if (goalCount > 0) {
        return {
          ...player,
          Goal_Scored: (Number(player.Goal_Scored) + goalCount).toString(),
        };
      }
      return player;
    });
    setplayersList(updatedPlayerList);
    savePlayerListToDB(updatedPlayerList);
  }
}


async function editGalleryImage(index){
  const { value: formValues } = await Swal.fire({
    title: "Edit Description",
    html: `
      <input id="swal-des" class="swal2-input" placeholder="Description" value=${galleryList[index].des}>
      
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    preConfirm: () => {
      
      return {
        URL: galleryList[index].URL,
        posted: galleryList[index].posted,
        type: galleryList[index].type,
        des: document.getElementById('swal-des').value
      };
    }
  });

  if (formValues) {
       const editedMedia = {
      URL: galleryList[index].URL,
      posted: galleryList[index].posted,
      type: galleryList[index].type,
      des: formValues.des 
    };
if(document.getElementById('swal-des').value==""){
  Swal.fire({
    title: "Null error",
    text: "No null input allowed!",
    icon: "error"
  });
  return
}

    let tempArr =galleryList 
    tempArr.splice(index,1)
    tempArr.push(editedMedia)
    setgalleryList(tempArr);
    saveGalleryListToDB(tempArr);
    Swal.fire("Updated!", "success");
  }
}




async function editPlayer(index) {
  
  const { value: formValues } = await Swal.fire({
    title: "Edit Player",
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Player Name" value=${playersList[index].Name}>
      <input id="swal-position" class="swal2-input" placeholder="Position" value=${playersList[index].Position}>
      <input id="swal-goals" type="number" class="swal2-input" placeholder="Goals Scored" value=${playersList[index].Goal_Scored}>
      <input id="swal-since" type="number" class="swal2-input" placeholder="Since (Year)" value=${playersList[index].Since}>
      <input id="swal-app" type="number" class="swal2-input" placeholder="Appearances" value=${playersList[index].app}>
      <br><br><br>
      <img src="${playersList[index].pp}" class="editPortalImg">
      <input style="width: 75%;" id="swal-img" class="swal2-input" type="file">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    preConfirm: () => {
      
      return {
        Name: document.getElementById("swal-name").value,
        Position: document.getElementById("swal-position").value,
        Goal_Scored: document.getElementById("swal-goals").value,
        Since: document.getElementById("swal-since").value,
        app: document.getElementById("swal-app").value,
        file: document.getElementById("swal-img").files[0] // Correct way to get the file
      };
    }
  });

  if (formValues) {
    let fileURL = playersList[index].pp;;
    
    if (formValues.file) {
      fileURL = await uploadFile(formValues.file); // Wait for file upload
    }

    const newPlayer = {
      Name: formValues.Name,
      Position: formValues.Position,
      Goal_Scored: formValues.Goal_Scored,
      Since: formValues.Since,
      app: formValues.app,
      pp: fileURL 
    };
if(newPlayer.Name=='' || newPlayer.Position==''|| formValues.Goal_Scored==''|| newPlayer.Since==''|| newPlayer.app=='' ){
  Swal.fire({
    title: "Null error",
    text: "No null input allowed!",
    icon: "error"
  });
  return
}

    let tempArr = [...playersList, newPlayer]; 
    tempArr.splice(index,1)
    setplayersList(tempArr);
    savePlayerListToDB(tempArr);

    Swal.fire("Updated!", "success");
  }
}









async function editMatch(index) {
  
  const { value: formValues } = await Swal.fire({
    title: "Edit Match",
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Team Name" value=${matchesList[index].Team}>
      <input id="swal-Ours" class="swal2-input" placeholder="Our Score" value=${matchesList[index].Ours}>
      <input id="swal-Opps" type="number" class="swal2-input" placeholder="Opponent Score" value=${matchesList[index].Opps}>
      <input id="swal-Location" type="String" class="swal2-input" placeholder="Location" value=${matchesList[index].Location}>
      <input id="swal-date" type="date" class="swal2-input" placeholder="Appearances" value=${matchesList[index].Date}>
      <br><br><br>
      <label>Other details can't be edited,You can delete and make a new match for that.</label>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    preConfirm: () => {
      
      return {
        Team: document.getElementById("swal-name").value,
        Ours: document.getElementById("swal-Ours").value,
        Opps: document.getElementById("swal-Opps").value,
        Location: document.getElementById("swal-Location").value,
        Date: document.getElementById("swal-date").value
            };
    }
  });

  if (formValues) {

    let status
    if(formValues.Ours==formValues.Opps){
      status="Draw"
    }else if(formValues.Ours<formValues.Opps){
status="Lost"
    }else{
      status="Won"
    }

        const updatedMatch = {
      Team: formValues.Team,
      Ours: formValues.Ours,
      Opps: formValues.Opps,
      Location: formValues.Location,
      Date: formValues.Date,
      Players: matchesList[index].Players,
      scorer: matchesList[index].scorer, 
      Status: status
    };
if(updatedMatch.Team=='' || updatedMatch.Ours==''|| updatedMatch.Opps==''|| updatedMatch.Location==''|| updatedMatch.Date=='' ){
  Swal.fire({
    title: "Null error",
    text: "No null input allowed!",
    icon: "error"
  });
  return
}
console.log("Updated Match ",updatedMatch)

    let tempArr =matchesList; 
    tempArr.splice(index,1)
    tempArr.push(updatedMatch)
    console.log("Updated Match List",tempArr)
    setmatchesList(tempArr);
    saveMatchesListToDB(tempArr);

    Swal.fire("Updated!", "success");
  }
}





function timeConverter(timestamp) {
  if (!timestamp || !timestamp.toDate) {
    console.error("Invalid Firestore Timestamp:", timestamp);
    return "Invalid Date";
  }

  let dateObj = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object

  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let year = dateObj.getFullYear();
  let month = months[dateObj.getMonth()];
  let date = String(dateObj.getDate()).padStart(2, '0');
  let hour = String(dateObj.getHours()).padStart(2, '0');
  let min = String(dateObj.getMinutes()).padStart(2, '0');
  let sec = String(dateObj.getSeconds()).padStart(2, '0');

  return `${date} ${month} ${year} ${hour}:${min}:${sec}`;
}



async function uploadFile(file) {
  if (!file) return null; 

  const storage = getStorage();
  const storageRef = ref(storage, `rivals-v2/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

async function deletePlayer(index) {
  Swal.fire({
    title: "Are you sure you want to delete this player?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(255, 127, 80)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      let tempArr=playersList;
      tempArr.splice(index,1)
      setplayersList(tempArr);
      savePlayerListToDB(playersList);
      Swal.fire({
        icon: "success",
        title: "Player Data removed succesfully.",
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
    }
  });
}




async function deleteMatch(index) {
  Swal.fire({
    title: "Are you sure you want to delete this Match?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(255, 127, 80)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
decreaseAppearances(matchesList[index].Players)
decreaseGoalScores(matchesList[index].scorer)
      let tempArr=matchesList;
      tempArr.splice(index,1)
      setmatchesList(tempArr);
      saveMatchesListToDB(tempArr);
      Swal.fire({
        icon: "success",
        title: "Match Data removed succesfully.",
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
    }
  });
}



async function decreaseAppearances(x) {
  if (x.length !== 0) {
   
      let updatedList = playersList; 
  
      for (let index = 0; index < x.length; index++) {
        let playerName = x[index];
        for (let index1 = 0; index1 < playersList.length; index1++) { 
          if (playerName === playersList[index1].Name) { 
            let newApp = Number(playersList[index1].app) - 1;
            updatedList[index1] = { 
             Goal_Scored:playersList[index1].Goal_Scored,
             Name:playersList[index1].Name,
             Position:playersList[index1].Position,
             Since:playersList[index1].Since,
             pp:playersList[index1].pp,
              app: newApp.toString()
            };
  
            break; 
          }
        }
      }
  
      setplayersList(updatedList); 
      savePlayerListToDB(updatedList); 
    }
  }
  
  
  async function increaseGoalScores(goals) {
    if (goals.length !== 0) {
      const updatedPlayerList = playersList.map(player => {
        const goalCount = goals.filter(name => name === player.Name).length;
        if (goalCount > 0) {
          return {
            ...player,
            Goal_Scored: (Number(player.Goal_Scored) + goalCount).toString(),
          };
        }
        return player;
      });
      setplayersList(updatedPlayerList);
      savePlayerListToDB(updatedPlayerList);
    }
  
}

async function decreaseGoalScores(goals) {
  if (goals.length !== 0) {
    let updatedList = playersList.map(player => {
      const goalCount = goals.filter(name => name === player.Name).length;
      if (goalCount > 0 && Number(player.Goal_Scored) > 0) {
        return {
          ...player,
          Goal_Scored: Math.max(0, Number(player.Goal_Scored) - goalCount).toString(),
        };
      }
      return player;
    });

    setplayersList(updatedList);
    savePlayerListToDB(updatedList);
  }
}




async function deleteGalleryImage(index) {
  Swal.fire({
    title: "Are you sure you want to delete this file?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(255, 127, 80)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      let tempArr=galleryList;
      tempArr.splice(index,1)
      setgalleryList(tempArr);
      saveGalleryListToDB(galleryList);
      Swal.fire({
        icon: "success",
        title: "Media removed succesfully.",
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
    }
  });
}


async function addEmailasAdmin() {
   document.getElementById('emailAdminInput').value=''
   if(addEmailInput==''){
    Swal.fire("Please enter email ID to register!");
    return
   }
  if (!adminLists.includes(addEmailInput)) {
    // State ko update karne ka sahi tareeqa
    setAdminLists(prevList => {
      const updatedList = [...prevList, addEmailInput]; // Naya array banao
      saveAdminListToDB(updatedList); // Firebase mein save karo
      Swal.fire({
        icon: "success",
        title: addEmailInput+" registered as admin.",
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
      return updatedList;
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Email is already registered as admin.",
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
  }
  setaddEmailInput("")
}

async function deleteEmail(key) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(255, 127, 80)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
    


      try {
        let tempArr = [...adminLists]; 
        let removedEmail = tempArr[key];
        if(removedEmail==="mkumail7860@gmail.com"){
          Swal.fire({
            icon: "error",
            title: "You can not delete devlopers ID!",
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
          return
        }
        tempArr.splice(key, 1); 
        setAdminLists(tempArr); 
        await saveAdminListToDB(tempArr); 
    
        Swal.fire({
          icon: "success",
          title: removedEmail + " removed! Refresh page.",
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
    
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to remove!",
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
      }


    }
  });
  
}


async function setSpecialPlayer() {
  const checkboxes = playersList
    .map(
      (player, index) => `
      <div style="display:flex; align-items:center; margin-bottom:5px;">
        <input type="checkbox" style="width:100px;" id="player${index}" value="${player.Name}" />
        <label for="player${index}" style="margin-left:5px;">${player.Name}</label>
      </div>
    `
    )
    .join(""); 

  const { value: selectedPlayers } = await Swal.fire({
    title: "Update Special Players",
    html: `<div>${checkboxes}</div>`,
    showCancelButton: true,
    confirmButtonText: "Select",
    preConfirm: () => {
      const selected = [];

      playersList.forEach((player, index) => {
        const checkbox = document.getElementById(`player${index}`);
        if (checkbox.checked) {
          selected.push(player.Name);
        }
      });

      if (selected.length !== 3) {
        Swal.showValidationMessage("⚠️ You need to select 3 players!!");
        return false;
      }

      saveSpecialPlayerListtoDB(selected);
      return selected;
    },
  });

  if (selectedPlayers) {
    Swal.fire(`Selected Players: ${selectedPlayers.join(", ")}`);
  }
}

async function saveSpecialPlayerListtoDB(data) {
  await setDoc(doc(db, "Rivals-FC-V2", "specialPlayerData"), {
    players: data, 
  });
}


async function editAboutMe() {
  const { value: formValues } = await Swal.fire({
    title: "Edit About Data",
    html: `
      <textarea id="swal-des" class="swal2-input" type="text" rows="10" cols="50" placeholder="Description">${aboutMeData}</textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    preConfirm: () => {
      return document.getElementById("swal-des").value.trim(); // Trim to remove extra spaces
    }
  });

  if (formValues) {
    if (formValues === "") {
      await Swal.fire({
        title: "Null error",
        text: "No null input allowed!",
        icon: "error"
      });
      return;
    }

    saveAboutMeData(formValues);
    await Swal.fire("Updated!", "Your about me section has been updated!", "success");
  }
}




async function viewSiteReviews() {
  const reviewsHTML = siteReviews
    .map(
      (data) => `
      <div style="margin-bottom:10px; padding:10px; border-bottom:1px solid #ccc;">
        <label><b>Date:</b> ${timeConverter(data.time)}</label><br>
        <label><b>Rating:</b> ${data.rating}</label><br>
        <label><b>Comments:</b> ${data.comments}</label>
      </div>
    `
    )
    .join(""); // ✅ Convert array to string

  await Swal.fire({
    title: "Site Reviews",
    html: reviewsHTML, // ✅ Correctly passing HTML
    focusConfirm: false,
    confirmButtonText: "Close",
  });
}


async function saveAdminListToDB(updatedList) {
  await setDoc(doc(db, "Rivals-FC-V2", "adminIDs"), {
    adminIDs: updatedList
  });
  // refresh()
  loadAllData();
  updateElement()

}
async function savePlayerListToDB(updatedList) {
  await setDoc(doc(db, "Rivals-FC-V2", "allPlayers"), {
    allPlayers: updatedList
  });
  // refresh()
  loadAllData();
  updateElement()

}


async function saveSlidesToDB() {
  await setDoc(doc(db, "Rivals-FC-V2", "slideShowImages"), {
    data: slideImg
  });

}


async function saveGalleryListToDB(updatedList) {
  await setDoc(doc(db, "Rivals-FC-V2", "allImages"), {
    allImages: updatedList
  });
  // refresh()
  loadAllData();
  updateElement()

}

async function saveAboutMeData(data) {
  await setDoc(doc(db, "Rivals-FC-V2", "aboutContent"), {
    aboutContent: data
  });
  loadAllData();
  updateElement()
}



async function saveMatchesListToDB(updatedList) {
  await setDoc(doc(db, "Rivals-FC-V2", "allMatches"), {
    allMatches: updatedList
  });
  // refresh()
  loadAllData();
  updateElement()
}

return (
  <>
    {(playersList.length===0 || matchesList.length===0 || galleryList.length===0) ? (
      <Loader />
    ) : (
      <div>
      <div className="adminBody">
        <h1>Admin Portal</h1>
<div id="boxx">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "300px",
            margin: "auto",
            border: "2px white solid",
            borderColor:"inherit"
          }}
        >
          <h6 style={{ color: "#ff7f50", fontSize: "16px", marginBottom: "10px" }}>
            Add Email as Admin!
          </h6>
          <div style={{ display: "flex", width: "100%", gap: "10px" }}>
            <input
              onChange={(e) => setaddEmailInput(e.target.value)}
              id="emailAdminInput"
              placeholder="Enter email"
              type="email"
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                outline: "none",
              }}
              required
            />
            <button
             className="btns"
              onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5722")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#ff7f50")}
              onClick={addEmailasAdmin}
            >
              Add
            </button>
          </div>
          <br />
          {adminListElement}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "300px",
            margin: "auto",
            border: "2px white solid",
            borderColor:"inherit",
            
          }}
        >
<h6 style={{ color: "rgb(255, 127, 80)", fontSize: "16px", marginBottom: "10px" }}>
  Special Options
</h6>
          <br/>
          <button onClick={editAboutMe} className="btns">Edit About me</button>

          <br/>
          <button onClick={viewSiteReviews} className="btns">View Site Reviews</button>
       <br/>
       <button onClick={setSpecialPlayer} className="btns">Set Special Players</button>
<br/>
<button className="btns" onClick={showImageAlert}>Show Slide Image</button>

        </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            
            
          }}
          className="Section"
        >
          <h1 style={{ color: "#ff7f50", marginBottom: "10px" }}>
            Players Section
          </h1>
          <div className="table-container">
          <table>
          <thead>
					      <tr>
					        <th>Picture</th>
					        <th>Name</th>
					        <th>Position</th>
					        <th>Scored</th>
					        <th>Since</th>
					        <th>Appearences</th>
                  <th>Edit</th>
                  <th>Delete</th>
					      </tr>
					    </thead>
          <tbody>
          {playerDetailsElement}
          </tbody>
         
          </table>
          </div>
      
          <button className="btns" onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5722")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#ff7f50")}
              onClick={addPlayer}
              >Add new player</button>
          
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "auto",
          }}
          className="Section"
        >
        <h1>Gallery Section</h1>
        <br/>
<button onClick={addMedia} className="btns">Add new media</button>
<br/>
<div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Media</th>
        <th>Description</th>
        <th>Posted on</th>
        <th>Delete</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      {galleryElement}  
    </tbody>
  </table>
</div>
        </div>





<br/>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "auto",
          }}
          className="Section"
        >
        <h1>Matches Section</h1>
        <br/>
<button onClick={addMatch} className="btns">Add new Match</button>
<br/>
<div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Opponent</th>
        <th>Status</th>
        <th>Score</th>
        <th>Scorer</th>
        <th>Players</th>
        <th>Location</th>
        <th>Delete</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      {matchesElement}  
    </tbody>
  </table>
</div>
        </div>



        <br/>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "auto",
          }}
          className="Section"
        >
        <h1>Matches Request</h1>
        <br/>
<br/>
<div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Team Name</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>
      {matchRequestElement}  
    </tbody>
  </table>
</div>
        </div>
        <br/><br/><br/><br/><br/><br/>
      </div>
           </div>  
    )}
  </>
);

}
