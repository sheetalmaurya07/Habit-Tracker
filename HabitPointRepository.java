package com.sheetal.habittracker.repository;

import com.sheetal.habittracker.entity.*;
import com.sheetal.habittracker.projection.*;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HabitPointRepository extends JpaRepository<HabitPoint, Long> {

    @Query(value = """
            SELECT 
                hp.id AS habitPointId,
                h.id AS habitId, 
                h.habit_name AS habitName, 
                COALESCE(hp.status, 'PENDING') AS status 
            FROM habits h 
            LEFT JOIN habit_points hp 
                ON h.id = hp.habit_id 
                AND hp.scheduled_date = :scheduledDate 
            WHERE h.user_id = :userId AND h.status = 'ACTIVE'
              -- AND h.start_date <= :scheduledDate
            """, nativeQuery = true)
    List<HabitPointStatusProjection> findHabitPointStatusesByDate(
            @Param("userId") Long userId, 
            @Param("scheduledDate") LocalDate scheduledDate
    );

    @Query(value = """
            SELECT 
                hp.id,
                hp.habit_id,
                hp.scheduled_date,
                hp.status,
                hp.points,
                hp.completed_at,
                hp.created_at
            FROM habits h 
            INNER JOIN habit_points hp 
                ON h.id = hp.habit_id 
            WHERE h.user_id = :userId AND h.status = 'ACTIVE'
                AND hp.status = 'COMPLETED'
            ORDER BY hp.habit_id, hp.scheduled_date DESC;
            """, nativeQuery = true)
    List<HabitPoint> findCompletedHabitPointsByUserId(@Param("userId") Long userId);

    @Query(value = """
        SELECT DISTINCT hp.scheduled_date AS completedDate
        FROM habit_points hp
        WHERE hp.habit_id = :habitId AND hp.status = 'COMPLETED' 
        ORDER BY hp.scheduled_date ASC;
        """, nativeQuery = true)
    List<HabitPointCompletedDatesProjection> findCompletedDatesByHabitId(@Param("habitId") Long habitId);

    @Query(value = """
        SELECT c.c_date AS scheduledDate, COALESCE(t.status, 'PENDING') AS status
        FROM mst_calendar c
        JOIN habits h ON h.user_id = :userId AND h.status = 'ACTIVE'
        LEFT JOIN (
            SELECT h.id, hp.scheduled_date, hp.status
            FROM habits h 
            INNER JOIN habit_points hp ON h.id = hp.habit_id 
            WHERE h.user_id = :userId AND h.status = 'ACTIVE'
        )t ON h.id = t.id AND c.c_date=t.scheduled_date
        WHERE c.c_date Between :fromDate AND :toDate
        """, nativeQuery = true)
    List<HabitPointRecordProjection> findHabitPointsByDate(
        @Param("userId") Long userId, 
        @Param("fromDate") LocalDate startDate,
        @Param("toDate") LocalDate endDate
    );

    @Query(value = """
        SELECT t.*, 
            DENSE_RANK() OVER (ORDER BY t.xp DESC) AS Rnk
        FROM (
            SELECT 
	            COALESCE(u.full_name, u.user_name) AS name,
	            h.user_id AS userId,
	            SUM(hp.points) AS xP
            FROM users u
            INNER JOIN habits h on u.id = h.user_id
            INNER JOIN habit_points hp 
	            ON h.id = hp.habit_id 
            WHERE h.status = 'ACTIVE' AND hp.status = 'COMPLETED'
            GROUP BY u.full_name,u.user_name,h.user_id
        )t 
        ORDER BY Rnk;
        """, nativeQuery = true)
    List<UserRankProjection> findUsersRank();

}
