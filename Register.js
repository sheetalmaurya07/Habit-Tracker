import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Toast from './Toast';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [toastProps, setToastProps] = useState({Message: '', show: false});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if(!form.userName || !form.email || !form.password){
      setErrorMessage('All fields are mandatory');
      return;
    }

    try {
      const response = await API.post("/users/register", form);
      
      if(response.data.isSuccess){
        setForm({ userName: "", email: "", password: "" });
        setToastProps({Message: 'User registered successfully', show: true });
        setTimeout(() => {
          setToastProps({Message: '', show: false });
          navigate("/login");
        }, 4000);
      }
      else{
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('error while registering', error);
      setErrorMessage('Error occured while registering user');
    }
  };

  return (
    <>
    <div className="signup-page">
      <div className="card auth-card">
        <h1>Create account 🚀</h1>
        <p className="muted" style={{margin:"5px 0 20px"}}>Start building consistent habits.</p>
        <form id="signupForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input id="userName" autoComplete="off" required maxLength={20} placeholder="Enter username"
            onChange={(e) => {setErrorMessage(''); setForm({ ...form, userName: e.target.value });}} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input id="signupEmail" type="email" autoComplete="off" required maxLength={100} placeholder="abc@xyz.com"
            onChange={(e) => {setErrorMessage(''); setForm({ ...form, email: e.target.value })}} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input id="signupPassword" type="password" minlength="4" autoComplete="off" required maxLength={50}
            placeholder="••••••••" onChange={(e) => {setErrorMessage(''); setForm({ ...form, password: e.target.value })}} />
            </div>
          <button className="btn btn-primary" style={{width:"100%"}}>Create Account</button>
        </form>
        {errorMessage && (
          <p style={{fontSize: '14px', color: 'red', marginTop:'18px'}}>
            {errorMessage}
          </p>
        )}
        <p className="muted" style={{marginTop:"18px", textAlign:"center"}}>Already registered? <a href="/login" style={{color:"var(--primary);", fontWeight:"700"}}>Sign in</a></p>
      </div>
    </div>
    <Toast 
        Message={toastProps.Message}
        show={toastProps.show}
      />
    </>
  );
}

export default Register;
