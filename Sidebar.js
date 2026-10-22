import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      };

    return (
        <>
        <aside className="sidebar">
            <div className="brand" >🌱 Habitify</div>
            <nav className="nav">
              <a className="nav-link" href="/">🏠 Dashboard</a>
              <a className="nav-link" href="/habits">✅ My Habits</a>
              <a className="nav-link" href="/tracker">📅 Tracker</a>
              <a className="nav-link" href="/gamify">🏆 Gamification</a>
              <a className="nav-link" href="/stats">📊 Statistics</a>
              <a className="nav-link" href="/profile">👤 Profile</a>
              <a className="nav-link" onClick={logout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg> Logout</a>
            </nav>
        </aside>
        </>
    )
}

export default Sidebar;