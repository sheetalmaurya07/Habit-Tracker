import React from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  isAfter
} from "date-fns";


const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HabitCalendar({
  currentMonth,
  selectedDate,
  calendarData,
  onMonthChange,
  onDateSelect
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Include days before/after month so calendar always shows full weeks
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getStatus = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");

    return calendarData.find(x => x.cdate === dateKey);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">

        <button
          type="button"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
        >
          &lt;
        </button>

        <h2>{format(currentMonth, "MMMM yyyy")}</h2>

        <button
          type="button"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
        >
          &gt;
        </button>

      </div>

      <div className="calendar-grid weekdays">
        {weekdays.map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">

        {days.map(day => {
          const dateStatus = getStatus(day);

          return (
            <button
              type="button"
              key={format(day, "yyyy-MM-dd")}
              className={`
                calendar-day
                ${!isSameMonth(day, currentMonth) ? "outside-month" : ""}
                ${isSameDay(day, selectedDate) ? "selected" : ""}
              `}
              onClick={() => onDateSelect(day)}
            >

              <span className={`day-number ${isToday(day) ? "today" : ""}`}>
                {format(day, "d")}
              </span>

              {dateStatus && (
                <ProgressIndicator data={dateStatus} />
              )}

            </button>
          );
        })}

      </div>
    </div>
  );
}

function ProgressIndicator({ data }) {
  const today = new Date();

  if ((data.totalHabits === 0) || (isAfter(data.cdate, today))) {
    return null;
  }

  if (data.completedHabits === data.totalHabits) {
    return (
      <span
        className="status-dot completed"
        title="All habits completed"
      />
    );
  }

  if (data.completedHabits > 0) {
    return (
      <span
        className="status-dot partial"
        title={`${data.completedHabits}/${data.totalHabits} completed`}
      />
    );
  }

  return (
    <span
      className="status-dot pending"
      title="No habits completed"
    />
  );
}
