import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/users/login", form);
    localStorage.setItem("token", data);
    //alert("Welcome back, " + form.username + "!");
    const { data: user } = await API.get(`/users/user?userName=${form.userName}`);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="auth-page">
        <div className="card auth-card">
          <h1>Welcome back 👋</h1>
          <p className="muted" style={{margin:"5px 0 20px"}}>Sign in to continue your habit journey.</p>
          <form id="signinForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>User Name</label>
              <input id="emailInput" type="text" autoComplete="off" required placeholder="Enter your username"
               maxLength={20}  onChange={(e) => setForm({ ...form, userName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input id="passwordInput" type="password" autoComplete="off" required placeholder="••••••••"
              maxLength={50}  onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" style={{width:"100%"}}>Sign In</button>
          </form>
          <p className="muted" style={{marginTop:"18px", textAlign:"center"}}>
            Don't have an account? <a href="/register" style={{color:"var(--primary);", fontWeight:"700"}}>Create one</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
