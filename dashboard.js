import React, { useEffect, useState } from "react";
import API from "../services/api";
import { format } from "date-fns";

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    totalHabits: 0,
    longestStreak: 0,
    totalXP: 0,
    completedToday: 0,
  });

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user")) || null;
    setUser(usr);
  }, []);

  useEffect(() => {
    if(user) {
      try {
        API.get(`/habits/dashboard?userid=${user.id}&today=${format(new Date(), 'yyyy-MM-dd')}`)
        .then((response) => setData(response.data))
        .catch((error) => {
          console.error('Error while fetching dashboard data', error);
          alert('Error while fetching dashboard data');
        });
      } catch(error) {
        console.error('Error while fetching dashboard data', error);
        alert('Error while fetching dashboard data');
      }
    }
  }, [user]);

  return (
    <div className="main">
      <div data-navbar></div>
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Your daily progress at a glance.</p>
        </div>
        <a className="btn btn-primary" href="/habits">+ Add Habit</a>
      </div>
      <div className="card welcome">
        <h2>Good day, <span id="welcomeName">{capitalizeWords(user?.fullName ?? (user?.userName ?? 'user'))}</span>! 🌟</h2>
        <p className="muted">Keep your streak alive and earn more XP today.</p>
        <div id="xpBar" style={{marginTop:"18px"}}>
      </div>
    </div>
    <div className="grid grid-4" style={{marginTop:"18px"}}>
      <div className="card">
        <div className="stat-number" id="habitCount">{data.totalHabits ?? 0}</div>
        <div className="stat-label">Total Habits</div>
      </div>
      <div className="card">
        <div className="stat-number" id="doneCount">{data.completedToday ?? 0}</div>
        <div className="stat-label">Completed Today</div>
      </div>
      <div className="card">
        <div className="stat-number" id="streakCount">{`${(data.longestStreak ?? 0)} ${(data.longestStreak ?? 0) > 1 ? 'days': 'day'}`}</div>
        <div className="stat-label">Best Streak</div>
      </div>
      <div className="card">
        <div className="stat-number" id="xpStat">{data.totalXP ?? 0}</div>
        <div className="stat-label">XP</div>
      </div>
    </div>
    <div className="grid grid-1" style={{marginTop:"18px"}}>
      <div className="card">
        <div className="row">
          <h2>Today's Habits</h2>
          <a className="muted" href="/tracker">View tracker →</a>
        </div>
        <div id="dashboardHabits" className="grid" style={{marginTop:"14px"}}>
        </div>
      </div>
      {/*<div className="card">
        <h2>28-Day Streak Calendar</h2>
        <div id="calendar" className="streak-calendar" style={{marginTop:"15px"}}>
        </div>
      </div>*/}
  </div>
</div>
  );
}

export default Dashboard;
