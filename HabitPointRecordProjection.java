package com.sheetal.habittracker.projection;

import java.time.LocalDate;

public interface HabitPointRecordProjection {
    LocalDate getScheduledDate();
    String getStatus();
}
