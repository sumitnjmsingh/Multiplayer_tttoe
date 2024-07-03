import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import {BrowserRouter as Router , Routes,Route} from "react-router-dom"
import { AuthContextProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
          <AuthContextProvider>
               <App />
          </AuthContextProvider>
   </Router>
    
    
  </React.StrictMode>,
)
