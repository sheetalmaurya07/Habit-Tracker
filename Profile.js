import React, { useMemo, useState, useEffect } from "react";
import API from "../services/api";
import Toast from './Toast';

function Profile() {
    const [toastProps, setToastProps] = useState({Message: '', show: false});
    const [fullName, setFullName] = useState(null);
    const [email, setEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const usr = JSON.parse(localStorage.getItem("user")) || null;
        setUser(usr);
    }, []);

    useEffect(() => {
        if(user) {
            setFullName(user?.fullName ?? '');
            setEmail(user?.email ?? '');
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if(!user)
            return;

        try {
            await API.post(`/users/profile`, { 
              ...user,
              fullName: fullName
            });
          setToastProps({Message: 'User profile updated successfully', show: true });
          setTimeout(() => {
            setToastProps({Message: '', show: false });
          }, 4000);
          setTimeout(() => {
            localStorage.setItem("user", JSON.stringify({...user, fullName: fullName}));
          }, 400);
        } catch (error) {
            console.error('error while updating user profile', error);
            setErrorMessage('Error occured while updating user profile');
        }
    }

    return (
        <div className="main">
            <div data-navbar></div>
            <div className="topbar">
                <div>
                    <h1>Profile</h1>
                    <p className="muted">Manage your account information.</p>
                </div>
            </div>
            <div className="card">
                <div className="profile-head">
                    <div id="profileInitial" className="profile-avatar">{user?.fullName?.[0]?.toUpperCase() ?? (user?.userName?.[0]?.toUpperCase() ?? '')}</div>
                    <div>
                        <h2>Your Profile</h2>
                        <p className="muted">Keep your information up to date.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} style={{marginTop:"24px"}}>
                    <div className="form-group">
                        <label>Name</label>
                        <input id="profileName" autoComplete="off" autoCapitalize="true" maxLength={100} value={fullName}
                        onChange={(e) => {setFullName(e.target.value);}} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input id="profileEmail" type="email" disabled value={email ?? ''} />
                    </div>
                    <button className="btn btn-primary">Save Changes</button>
                </form>   
                {errorMessage && (
                    <p style={{fontSize: '14px', color: 'red', marginTop:'18px'}}>
                        {errorMessage}
                    </p>
                )}
            </div>
            
            <Toast 
                Message={toastProps.Message}
                show={toastProps.show}
            />
        </div>
    );
}

export default Profile;