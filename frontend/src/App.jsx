// client/src/App.js
import React, { useState } from 'react';
import Game from './components/Game';
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import {Navigate,BrowserRouter as Router , Routes,Route} from "react-router-dom"
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
const App = () => {
  const { authUser } = useAuthContext();

  return (
    
    
   <> <Routes>
       <Route path="/" element={<Register/>}></Route>
       <Route path="/Game" element={authUser ? <Game /> : <Navigate to="/Login" />}></Route>
       <Route path="/Login" element={<Login/>}></Route>
    </Routes>
    <Toaster />
    </>
  
  );
};

export default App;
