package com.sheetal.habittracker.projection;

import java.time.LocalDate;

public interface  HabitTrackerProjection {
    LocalDate getCDate();
    Integer getTotalHabits();
    Integer getCompletedHabits();
}
