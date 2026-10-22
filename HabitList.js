import React, { useEffect, useState } from "react";
import API from "../services/api";
import Toast from './Toast';
import { add, format } from 'date-fns';

function HabitList() {
  const [habits, setHabits] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [toastProps, setToastProps] = useState({Message: '', show: false});
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState(
    {
      habitName: '',
      targetValue: 1,
      targetUnit: 'times'
    }
  );
  const [editHabitItem, setEditHabitItem] = useState({});

  const fetchHabits = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || null;
      API.get(`/habits/user?userId=${user.id}&today=${format(new Date(), 'yyyy-MM-dd')}`).then((res) => setHabits(res.data));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  const openCloseAddHabit = (value) => {
    setIsOpenModal(value);
  }

  const resetForm = () =>{
    setForm({
      habitName: '',
      targetValue: 1,
      targetUnit: 'times'
    });
    setEditHabitItem({});
  }

  const addUpdateHabit = async (isEdit) => {
    if(isEdit)
      await updateHabit();
    else 
      await addHabit();
  }

  const addHabit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || null;
      await API.post("/habits", { 
        ...form, userId: user.id, 
        startDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'ACTIVE',
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      });
    setIsOpenModal(false);
    setToastProps({Message: 'Habit added successfully', show: true });
    setTimeout(() => {
      setToastProps({Message: '', show: false });
    }, 4000);
    setTimeout(() => {
    resetForm();
    fetchHabits();
    }, 400);
    } catch (error) {
      console.error('error while creating Habit', error);
      setErrorMessage('Error occured while creating Habit');
    }
  }

  const updateHabit = async () => {
    try {
      await API.post(`/habits/update`, { 
        ...editHabitItem,
        habitName: form.habitName,
        targetValue: form.targetValue,
        targetUnit: form.targetUnit
      });
    setIsOpenModal(false);
    setToastProps({Message: 'Habit updated successfully', show: true });
    setTimeout(() => {
      setToastProps({Message: '', show: false });
    }, 4000);
    setTimeout(() => {
    resetForm();
    fetchHabits();
    }, 400);
    } catch (error) {
      console.error('error while updating Habit', error);
      setErrorMessage('Error occured while updating Habit');
    }
  }

  const toggleHabit = (event) => {
    setToastProps({Message: 'Habit updated successfully', show: true });
    setTimeout(() => {
      setToastProps({Message: '', show: false });
    }, 4000);
  }

  const deleteHabit = async (habit) => {
    try {
      await API.post(`/habits/delete`, { 
        ...habit,
        endDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'INACTIVE',
        archivedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      });
    setToastProps({Message: 'Habit deleted successfully', show: true });
    setTimeout(() => {
      setToastProps({Message: '', show: false });
    }, 4000);
    setTimeout(() => {
    fetchHabits();
    }, 400);
    } catch (error) {
      console.error('error while deleting Habit', error);
      alert('Error occured while deleting Habit');
    }
  }

  return (
    <div className="main">
      <div data-navbar></div>
      <div className="topbar">
        <div>
          <h1>My Habits</h1>
          <p className="muted">Create, manage and complete your habits.</p>
        </div>
        <button className="btn btn-primary" onClick={(event) => {event.preventDefault();openCloseAddHabit(true)}}>+ Add Habit</button>
      </div>
      <div id="habitsList" className="habit-list">
        {
          habits?.filter?.(f => f.status === 'ACTIVE')?.map((item) => {
            const streak = item?.currentStreak ?? 0;

            return (<div className="card habit-card" key={item.id}>
              <div className="row">
                <div className="row">
                  {/*<span className="habit-icon">💧</span>*/}
                  <div>
                    <h3>{item.habitName}</h3>
                    <span className="muted">Goal: {item.targetValue} {item.targetUnit}</span>
                  </div>
                </div>
                {/*<input className="habit-check" type="checkbox" checked="" onChange={toggleHabit} />*/}
              </div>
              <div className="row" style={{marginTop:"12px"}}>
                <span className="habit-streak">🔥 {`${streak} ${streak > 1 ? 'days': 'day'}`} streak</span>
                <button className="btn btn-primary" 
                onClick={(event) => {
                  event.preventDefault();
                  setForm({
                    habitName: item.habitName,
                    targetValue: item.targetValue,
                    targetUnit: item.targetUnit
                  });
                  setEditHabitItem(item);
                  openCloseAddHabit(true)
                }} 
                style={{marginLeft:'20px'}}>Edit</button>
                <button className="btn btn-danger" onClick={(event) => {
                  event.preventDefault();
                  deleteHabit(item);
                }
                } style={{marginLeft:'20px'}}>Delete</button>
              </div>
            </div>)
          })
        }
        {habits.length == 0 && (
          <div> 
            <p>
              No Habits Exists
            </p>
          </div>
        )}

      </div>
      <div id="habitModal" className={`modal${isOpenModal?' open':''}`}>
        <div className="modal-box">
          <div className="row" style={{display:'flex', justifyContent: 'space-between'}}>
            <h2>{`${editHabitItem?.id > 0 ? 'Edit': 'New'}`} Habit</h2>
            <button className="btn btn-light" onClick={(event) => {
              event.preventDefault(); 
              resetForm();
              openCloseAddHabit(false);
              }}>✕</button>
          </div>
          <form onSubmit={() => {
            addUpdateHabit(editHabitItem?.id > 0);
          }} style={{marginTop:"18px"}}>
            <div className="form-group">
              <label>Name</label>
              <input id="newHabitName" autoComplete="off" required placeholder="Meditate" value={form.habitName}
              maxLength={100} onChange={(e) => {setForm({ ...form, habitName: e.target.value });}} />
            </div>
            <div className="form-group">
              <label>Target</label>
              <input id="newHabitTarget" type="number" value={form.targetValue} min="1" max="100000"
              onChange={(e) => {setForm({ ...form, targetValue: e.target.value });}} />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input id="newHabitUnit" type="text" autoComplete="off" value={form.targetUnit}
              maxLength={20} onChange={(e) => {setForm({ ...form, targetUnit: e.target.value });}} />
            </div>
            <button className="btn btn-primary" style={{width:"100%"}}>{`${editHabitItem?.id > 0 ? 'Update': 'Add'}`} Habit</button>
          </form>
          {errorMessage && (
          <p style={{fontSize: '14px', color: 'red', marginTop:'18px'}}>
            {errorMessage}
          </p>
        )}
        </div>
      </div>

      <Toast 
        Message={toastProps.Message}
        show={toastProps.show}
      />
  </div>
  );
}

export default HabitList;
