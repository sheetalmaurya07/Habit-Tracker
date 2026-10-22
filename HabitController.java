package com.sheetal.habittracker.controller;

import com.sheetal.habittracker.entity.*;
import com.sheetal.habittracker.projection.*;
import com.sheetal.habittracker.dto.*;
import com.sheetal.habittracker.service.HabitPointService;
import com.sheetal.habittracker.service.HabitService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
// @CrossOrigin(origins = "*", allowedHeaders = "*")
public class HabitController {
    private final HabitService habitService;
    private final HabitPointService habitPointService;

    public HabitController(HabitService habitService, HabitPointService habitPointService) {
        this.habitService = habitService;
        this.habitPointService = habitPointService;
    }

    @GetMapping
    public List<Habit> getHabits() {
        return habitService.getAllHabits();
    }

    @PostMapping
    public Habit createHabit(@RequestBody Habit habit) {
        return habitService.saveHabit(habit);
    }

    @GetMapping("/user")
    public List<HabitDto> getUserHabits(@RequestParam Long userId, @RequestParam LocalDate today) {
        List<Habit> habits = habitService.getAllHabits().stream()
                .filter(h -> h.getUserId() == userId && h.getStatus().equalsIgnoreCase("ACTIVE"))
                .toList();

        List<HabitPoint> habitPoints = habitPointService.getCompletedHabitPointsByUserId(userId);

        List<HabitDto> habitsDto = getUserHabitList(habits, habitPoints, today);

        return habitsDto;
    }

    @PostMapping("/update")
    public Habit updateHabit(@RequestBody Habit habit) {
        return habitService.updateHabit(habit);
    }

    @PostMapping("/delete")
    public CustomResponse deleteHabit(@RequestBody Habit habit) {
        Boolean isDeleted = habitService.deleteHabit(habit);

        CustomResponse response;
        if (isDeleted) {
            response = new CustomResponse();
            response.setIsSuccess(true);
            response.setId(null);
            response.setMessage("Habit deleted successfully");

            return response;
        }

        response = new CustomResponse();
        response.setIsSuccess(false);
        response.setId(null);
        response.setMessage("Seems like Habit does not exists");

        return response;
    }

    @GetMapping("/habit-tracker")
    public ResponseEntity<List<HabitTrackerProjection>> getHabitTrackerByDate(
            @RequestParam("userid") Long userId,
            @RequestParam("fromdate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam("todate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        List<HabitTrackerProjection> results = habitService.getHabitTracker(userId, fromDate, toDate);

        return ResponseEntity.ok(results);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboardData(@RequestParam("userid") Long userId,
        @RequestParam("today") LocalDate today) 
    {
        List<Habit> habits = habitService.getAllHabits().stream()
                .filter(h -> h.getUserId() == userId && h.getStatus().equalsIgnoreCase("ACTIVE"))
                .toList();

        List<HabitPoint> habitPoints = habitPointService.getCompletedHabitPointsByUserId(userId);
        
        DashboardDto dashboardDto = getUserDashboardData(habits, habitPoints, today);

        return ResponseEntity.ok(dashboardDto);
    }

    private DashboardDto getUserDashboardData(List<Habit> habits, List<HabitPoint> habitPoints, LocalDate today)
    {
        DashboardDto dashboardDto = new DashboardDto();

        List<HabitPoint> todaysCompleted = habitPoints.stream()
                .filter(h -> h.getScheduledDate().equals(today))
                .toList();

        int totalXP = habitPoints.stream()
                            .mapToInt(HabitPoint::getPoints)
                            .sum();

        dashboardDto.setTotalXP(totalXP);
        dashboardDto.setTotalHabits(habits.size());
        dashboardDto.setCompletedToday(todaysCompleted.size());

        Integer longestStreak = 0;

        for (Habit habit : habits) {
            List<HabitPointCompletedDatesProjection> lst = habitPointService.getCompletedDatesByHabitId(habit.getId());
            List<LocalDate> completedDates = lst.stream()
                .map(HabitPointCompletedDatesProjection::getCompletedDate)
                .toList();

            if (completedDates == null || completedDates.isEmpty()) {
                 continue;
            }
            
            LocalDate previousDate = null;
            Integer currentStreak = 0;

            for (LocalDate currentDate : completedDates) {
                if (previousDate == null) {
                    // First element initializes the streak
                    currentStreak = 1;
                } else if (currentDate.minusDays(1).equals(previousDate)) {
                    // Date is consecutive; grow the current chain
                    currentStreak++;
                } else {
                    // Gap encountered; break streak, record if it's the highest, and reset
                    if (currentStreak > longestStreak) {
                        longestStreak = currentStreak;
                    }
                    currentStreak = 1; // resets to 1 to count the current day
                }
                previousDate = currentDate;
                longestStreak = Math.max(currentStreak, longestStreak);
            }
        }

        dashboardDto.setLongestStreak(longestStreak);

        return dashboardDto;
    }

    private List<HabitDto> getUserHabitList(List<Habit> habits, List<HabitPoint> habitPoints, LocalDate today)
    {
        List<HabitDto> habitsDto = new ArrayList<>();

        for (Habit habit : habits) {
            HabitDto habitDto = new HabitDto();
            habitDto.setId(habit.getId());
            habitDto.setHabitName(habit.getHabitName());
            habitDto.setStartDate(habit.getStartDate());
            habitDto.setEndDate(habit.getEndDate());
            habitDto.setTargetValue(habit.getTargetValue());
            habitDto.setTargetUnit(habit.getTargetUnit());
            habitDto.setStatus(habit.getStatus());
            habitDto.setCurrentStreak(0);
            habitDto.setLongestStreak(0);

            Integer currentStreak = 0;

            LocalDate currentDate = today;

            while (true) {
                final LocalDate dateToCheck = currentDate;

                HabitPoint point = habitPoints.stream()
                    .filter(h -> h.getHabitId().equals(habit.getId()) && dateToCheck.isEqual(h.getScheduledDate()))
                    .findFirst()
                    .orElse(null); 
                
                if(point != null)
                    currentStreak++;
                else if(point == null && currentDate.isEqual(today)) {
                    currentDate = currentDate.minusDays(1);
                    continue;
                }
                else {
                    currentDate = LocalDate.now();
                    break;
                }

                // Back the date by 1 day to prevent an infinite loop
                currentDate = currentDate.minusDays(1);
            }
            habitDto.setCurrentStreak(currentStreak);

            habitsDto.add(habitDto);
        }

        return habitsDto;
    }

    @GetMapping("/statistics")
    public ResponseEntity<StatsDto> getUserHabitStats(@RequestParam("userid") Long userId,
        @RequestParam("today") LocalDate today,
        @RequestParam("fromdate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam("todate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) 
    {
        StatsDto statsDto = new StatsDto();

        List<Habit> habits = habitService.getAllHabits().stream()
                .filter(h -> h.getUserId() == userId && h.getStatus().equalsIgnoreCase("ACTIVE"))
                .toList();

        List<HabitPoint> habitPoints = habitPointService.getCompletedHabitPointsByUserId(userId);
        
        DashboardDto dashboardDto = getUserDashboardData(habits, habitPoints, today);

        List<HabitDto> habitsDto = getUserHabitList(habits, habitPoints, today);

        List<HabitTrackerProjection> tracker = habitService.getHabitTracker(userId, fromDate, toDate);

        int totalActivity = tracker.stream()
                            .mapToInt(HabitTrackerProjection::getTotalHabits)
                            .sum();

        int completedActivity = tracker.stream()
                            .mapToInt(HabitTrackerProjection::getCompletedHabits)
                            .sum();

        int currentStreak = habitsDto.stream()
                            .mapToInt(HabitDto::getCurrentStreak)
                            .max()
                            .orElse(0);

        statsDto.setTotalActivity(totalActivity);
        statsDto.setCompletedActivity(completedActivity);
        statsDto.setLongestStreak(dashboardDto.getLongestStreak());  
        statsDto.setCurrentStreak(currentStreak);

        return ResponseEntity.ok(statsDto);
    }
}
