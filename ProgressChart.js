import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import API from "../services/api";

// 1. Import the necessary components from chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// 2. Register the components to fix both errors
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ProgressChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || null;
      // Added a safety check in case user or username is missing
      if (user?.username) {
        API.get(`/habits/user?username=${user.username}`).then((res) => setData(res.data));
      }
    } catch (error) {
      console.error(error);
      setData([]);
    }
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: data.map((h) => h.habitName),
      datasets: [
        {
          label: "Habit Streaks",
          data: data.map((h) => h.streak),
          borderColor: "blue",
          fill: false,
        },
      ],
    };
  }, [data]);

  // Render the chart only if data exists to avoid initial blank rendering issues
  return data.length > 0 ? <Line data={chartData} /> : <p>Loading chart data...</p>;
}

export default ProgressChart;
