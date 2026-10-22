package com.sheetal.habittracker.controller;

import com.sheetal.habittracker.entity.*;
import com.sheetal.habittracker.projection.*;
import com.sheetal.habittracker.service.HabitPointService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habitpoints")
public class HabitPointController {
    private final HabitPointService habitPointService;

    public HabitPointController(HabitPointService habitPointService) {
        this.habitPointService = habitPointService;
    }

    @GetMapping
    public List<HabitPoint> getHabits() {
        return habitPointService.getAllHabitPoints();
    }

    @PostMapping("/add-update")
    public CustomResponse createHabit(@RequestBody HabitPoint habitPoint) {
        HabitPoint result = habitPointService.saveHabitPoint(habitPoint);

        CustomResponse response =  new CustomResponse();
        response.setIsSuccess(true);
        response.setId(result.getId());
        response.setMessage("Status updated successfully");

        return  response;
    }

    @GetMapping("/habit-point-status")
    public ResponseEntity<List<HabitPointStatusProjection>> getHabitPointsStatusByDate(
            @RequestParam("userid") Long userId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate sDate) {
        
        List<HabitPointStatusProjection> results = habitPointService.getHabitPointStatusesByDate(userId, sDate);

        return ResponseEntity.ok(results);
    }

    @GetMapping("/weekly-progress")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyProgress(@RequestParam("userid") Long userId,
        @RequestParam("today") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate today) 
    {
        // Start from Monday 4 weeks ago
        LocalDate currentMonday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate startDate = currentMonday.minusWeeks(4);

        // Fetch records from DB
        List<HabitPointRecordProjection> records = habitPointService.getHabitPointsByDate(userId, startDate, today);

        // Structure to store counts per week offset (0 = current week, 1 = 1 week ago, etc.)
        Map<Integer, int[]> weekCounts = new HashMap<>();
        for (int i = 0; i <= 4; i++) {
            weekCounts.put(i, new int[]{0, 0}); // [completedCount, totalCount]
        }

        // Categorise records into their respective weeks
        for (HabitPointRecordProjection record : records) {
            LocalDate date = record.getScheduledDate();
            LocalDate recordMonday = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            
            // Calculate how many weeks ago this record belongs to
            int weeksAgo = (int) java.time.temporal.ChronoUnit.WEEKS.between(recordMonday, currentMonday);

            if (weeksAgo >= 0 && weeksAgo <= 4) {
                int[] counts = weekCounts.get(weeksAgo);
                counts[1]++; // increment total
                if ("COMPLETED".equalsIgnoreCase(record.getStatus())) {
                    counts[0]++; // increment completed
                }
            }
        }

        // Build JSON response format
        List<Map<String, Object>> response = new ArrayList<>();
        for (int i = 4; i >= 0; i--) {
            Map<String, Object> weekData = new LinkedHashMap<>();
            String name = (i == 0) ? "Current" : "Week " + (5 - i);
            
            int[] counts = weekCounts.get(i);
            int total = counts[1];
            int completed = counts[0];
            int rate = (total == 0) ? 0 : Math.round(((float) completed / total) * 100);

            weekData.put("name", name);
            weekData.put("completionRate", rate);
            response.add(weekData);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users-rank")
    public ResponseEntity<List<UserRankProjection>> getUsersRank() {
        
        List<UserRankProjection> results = habitPointService.getUsersRank();

        return ResponseEntity.ok(results);
    }
}
