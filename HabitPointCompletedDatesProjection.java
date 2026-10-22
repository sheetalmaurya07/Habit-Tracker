package com.sheetal.habittracker.projection;

import java.time.LocalDate;

public interface HabitPointCompletedDatesProjection {
    LocalDate getCompletedDate();
}
