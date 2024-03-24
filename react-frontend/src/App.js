import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./firebase/Auth";
import Login from "./components/Login";
import SignUpPage from "./components/SignUp";
import Home from "./components/Home";
import MyCloset from "./components/MyCloset";
import StartPage from "./components/StartPage"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useState } from "react";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={ <Login />}
            />
            <Route
              path="/register"
              element={<SignUpPage />}
            />
            <Route
              path="/myCloset"
              element={<MyCloset />}
            />
          </Routes>
        </div>
        <footer className="App-footer"></footer>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
