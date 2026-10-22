package com.sheetal.habittracker.projection;

public interface HabitPointStatusProjection {
    Long getHabitPointId();
    Long getHabitId();
    String getHabitName();
    String getStatus();
}
