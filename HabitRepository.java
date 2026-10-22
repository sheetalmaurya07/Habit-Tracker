package com.sheetal.habittracker.repository;

import com.sheetal.habittracker.entity.*;
import com.sheetal.habittracker.projection.*;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HabitRepository extends JpaRepository<Habit, Long> {

    @Query(value = """
            SELECT c.c_date AS cDate, COUNT(h.id) AS totalHabits, COALESCE(COUNT(t.habit_point_id),0) AS completedHabits
FROM mst_calendar c
JOIN habits h ON h.user_id = :userId AND h.status = 'ACTIVE'
LEFT JOIN (
SELECT h.id, hp.scheduled_date, hp.id AS habit_point_id
FROM habits h 
INNER JOIN habit_points hp ON h.id = hp.habit_id AND hp.status='COMPLETED'
WHERE h.user_id = :userId AND h.status = 'ACTIVE'
)t ON h.id = t.id AND c.c_date=t.scheduled_date
WHERE c.c_date between :fromDate AND :toDate
Group By c.c_date;
            """, nativeQuery = true)
    List<HabitTrackerProjection> findHabitTracker(
        @Param("userId") Long userId,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );
}
