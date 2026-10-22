import React, { useState, useEffect } from "react";
import WeeklyProgressChart from "./WeeklyProgressChart";
import API from "../services/api";
import { format, addDays, addWeeks } from "date-fns";

function Statistics() {
  const [user, setUser] = useState(null);
  const [statsData, setStatsData] = useState({});
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user")) || null;
    setUser(usr);
  }, []);

  useEffect(() => {
    if(user) {
      const strToday = format(new Date(), 'yyyy-MM-dd');
      const fromDate = format(addDays(new Date(), -30), 'yyyy-MM-dd');
      const toDate = format(new Date(), 'yyyy-MM-dd');

      try {
        API.get(`/habits/statistics?userid=${user.id}&today=${strToday}&fromdate=${fromDate}&todate=${toDate}`)
        .then((response) => setStatsData(response.data))
        .catch((error) => {
          console.error('Error while fetching statistics data', error);
          alert('Error while fetching statistics data');
        });
      } catch(error) {
        console.error('Error while fetching statistics data', error);
        alert('Error while fetching statistics data');
      }
    }
  }, [user]);

  useEffect(() => {
    if(user) {
      const strToday = format(new Date(), 'yyyy-MM-dd');

      try {
        API.get(`/habitpoints/weekly-progress?userid=${user.id}&today=${strToday}`)
        .then((response) => setWeeklyProgress(response.data))
        .catch((error) => {
          console.error('Error while fetching weekly progress data', error);
          alert('Error while fetching weekly progress data');
        });
      } catch(error) {
        console.error('Error while fetching weekly progress data', error);
        alert('Error while fetching weekly progress data');
      }
    }
  }, [user]);

    return (
      <div className="main">
        <div data-navbar></div>
        <div className="topbar">
            <div>
                <h1>Statistics 📊</h1>
                <p className="muted">Understand your consistency over time.</p>
            </div>
        </div>
        <div className="grid grid-3">
            <div className="card">
                <div className="stat-number" id="totalHabits">
                    {(((statsData?.completedActivity ?? 0)/((statsData?.totalActivity ?? 0)<=0?1:(statsData?.totalActivity ?? 0)))*100).toFixed(2)}
                    <span style={{ fontSize: "14px", color: "var(--primary-light)", paddingLeft: "10px"}}>
                      {(statsData?.totalActivity ?? 0) <= 0 ? '' : 
                        `${(statsData?.completedActivity ?? 0)} of ${(statsData?.totalActivity ?? 0)} completed`
                      }
                    </span>
                </div>
                <div className="stat-label">
                  Completion Rate
                  <span style={{fontSize: "11px", paddingLeft: "5px"}}>(*calculated on last 30 days)</span>
                </div>
            </div>
            <div className="card">
                <div className="stat-number" id="bestStreak">{`${(statsData?.currentStreak ?? 0)} ${(statsData?.currentStreak ?? 0) > 1 ? 'days': 'day'}`}</div>
                <div className="stat-label">Current Streak</div>
            </div>
            <div className="card">
                <div className="stat-number" id="totalXP">{`${(statsData?.longestStreak ?? 0)} ${(statsData?.longestStreak ?? 0) > 1 ? 'days': 'day'}`}</div>
                <div className="stat-label">Longest Streak</div>
            </div>
        </div>
        <WeeklyProgressChart
        data={weeklyProgress}
      />
    </div>
    );
}

export default Statistics;