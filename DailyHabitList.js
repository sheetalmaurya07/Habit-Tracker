import React from "react";
import { format } from "date-fns";

export default function DailyHabitList({
  selectedDate,
  habitPointStatus,
  loading,
  onToggle
}) {
  return (
    <div className="daily-habits card">

      <h3 className="muted" style={{marginBottom: '10px'}}>
        {format(selectedDate, "EEEE, d MMMM yyyy")}
      </h3>

      {loading && <p className="muted">Loading...</p>}

      {!loading && (habitPointStatus?.length ?? 0) === 0 && (
        <p className="muted">No habits scheduled for this date.</p>
      )}

      {!loading && habitPointStatus.map(habit => { 
        const completed = habit.status === 'COMPLETED';
        return (
        <label
          className="habit-row muted"
          key={`${habit.habitPointId}-${habit.habitId}`}
        >

          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(habit)}
          />

          <span>{habit.habitName}</span>

          <span
            className={
              completed
                ? "habit-completed"
                : "habit-pending"
            }
          >
            {completed ? "Completed" : "Pending"}
          </span>

        </label>
      ) })}

    </div>
  );
}