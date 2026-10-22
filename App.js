import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard";
import Sidebar from "./components/Sidebar";
import HabitList from './components/HabitList';
import Tracker from './components/Tracker';
import GamificationBadge from "./components/GamificationBadge";
import Statistics from './components/Statistics';
import Profile from './components/Profile';

function Layout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const refresh = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  return (
    <>
      {localStorage.getItem("token") && (<Sidebar />)}
    <div className="app">

      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <>
            {localStorage.getItem("token") ? <Dashboard /> : <StartSection />}
            </>
          } />
          <Route path="/habits" element={
            <Protected><HabitList /></Protected>
          } />
          <Route path="/tracker" element={
            <Protected><Tracker /></Protected>
          } />
          <Route path="/gamify" element={
            <Protected><GamificationBadge /></Protected>
          } />
          <Route path="/stats" element={
            <Protected><Statistics /></Protected>
          } />
          <Route path="/profile" element={
            <Protected><Profile /></Protected>
          } />
        </Routes>
    </div>
    </>
  );
}

function Protected({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" replace />;
}

function StartSection () {

  return (<section className="hero">
    <div className="card">
      <div style={{fontSize:"4rem"}}>🌱</div><h1>Build better habits. Level up your life.</h1>
      <p>Track daily habits, build streaks, earn XP and unlock badges with a simple gamified habit tracker.</p>
      <div className="actions" style={{justifyContent:"center"}}>
        <a className="btn btn-primary" href="/register">Get Started</a>
        <a className="btn btn-light" href="/login">Sign In</a>
      </div>
    </div>
  </section>)
}


export default function App() {
  return <Layout />;
}
