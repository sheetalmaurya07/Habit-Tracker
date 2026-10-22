import React, { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, isAfter } from "date-fns";
import API from "../services/api";

import HabitCalendar from "./HabitCalendar";
import DailyHabitList from "./DailyHabitList";

export default function Tracker() {
  const today =  new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [calendarData, setCalendarData] = useState([]);
  const [habitPointStatus, setHabitPointStatus] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCalendar();
  }, [currentMonth]);

  useEffect(() => {
    loadHabitsForDate();
  }, [selectedDate]);

  const loadCalendar = async () => {

    const fromDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const toDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

    if(isAfter(fromDate, today)){
      setCalendarData([]);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user")) || null;
      const response = await API.get(`/habits/habit-tracker?userid=${user.id}&fromdate=${fromDate}&todate=${toDate}`);

      setCalendarData(response.data);

    } catch(error) {
      console.error('Error while fetching tracker data', error);
      alert('Error while fetching tracker data');
    }
  };

  const loadHabitsForDate = async () => {
    if(isAfter(selectedDate, today)){
      setHabitPointStatus([]);
      return;
    }

    setLoading(true);

    try {
      const date = format(selectedDate, "yyyy-MM-dd");
      const user = JSON.parse(localStorage.getItem("user")) || null;
      const response = await API.get(`/habitpoints/habit-point-status?userid=${user.id}&date=${date}`);

      setHabitPointStatus(response.data);

    } catch(error) {
      console.error('Error while fetching data', error);
      alert('Error while fetching data');
    }
    finally {
      setLoading(false);
    }
  };

  const handleToggle = async (habitpoint) => {

    const date = format(selectedDate, "yyyy-MM-dd");
    const obj = {
      habitId: habitpoint.habitId,
      scheduledDate: date,
      status: habitpoint.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
      points: 10,
      completedAt: habitpoint.status === 'PENDING' ? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss") : null,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
    };
    if (habitpoint.habitPointId) obj.id = habitpoint.habitPointId;

    try {
      await API.post(`/habitpoints/add-update`, obj);

    // Refresh selected date
    await loadHabitsForDate();

    // Refresh monthly progress
    await loadCalendar();

    } catch(error) {
      console.error('Error while updating data', error);
      alert('Error while updating data');
    }
  };

    return (
      <div className="main">
        <div data-navbar>

        </div>
        <div className="topbar">
          <div>
            <h1>Daily Tracker</h1>
            <p className="muted">Check off your habits as you complete them.</p>
          </div>
        </div>
        {/*<div className="card">
          <div className="tracker-day">
            Today · <span className="muted" id="todayLabel"></span>
          </div>
          <div id="trackerList" className="grid" style={{marginTop:"16px"}}>
          </div>
        </div>*/}
        <div id='tracker'>
        <HabitCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        calendarData={calendarData}
        onMonthChange={setCurrentMonth}
        onDateSelect={setSelectedDate}
      />

      <DailyHabitList
        selectedDate={selectedDate}
        habitPointStatus={habitPointStatus}
        loading={loading}
        onToggle={handleToggle}
      />
        </div>
      </div>
    );
}
