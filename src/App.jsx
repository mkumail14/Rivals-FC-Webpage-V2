import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './myComponents/navbar';
import Home from './myComponents/home';
import Gallery from './myComponents/gallery';
import Players from './myComponents/players';
import Matches from './myComponents/matches';
import Contact from './myComponents/contact';
import Admin from './myComponents/admin';
import AdminPortal from './myComponents/adminPortal';
import Register from './myComponents/register';
import Footer from './myComponents/footer'





function App() {

  return (
    <Router>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Players" element={<Players />} />
        <Route path="/Matches" element={<Matches />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Adminportal" element={<AdminPortal />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    <Footer />
  </Router>
  );
}

export default App;
