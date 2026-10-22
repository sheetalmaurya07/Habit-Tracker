package com.sheetal.habittracker.dto;

public class DashboardDto {
    private Integer totalHabits;
    private Integer longestStreak;
    private Integer totalXP;
    private Integer completedToday;

    // Constructors
    public DashboardDto() {}

    // Getters and Setters
    public Integer getTotalHabits() { return totalHabits; }
    public void setTotalHabits(Integer totalHabits) { this.totalHabits = totalHabits; }

    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }
    
    public Integer getTotalXP() { return totalXP; }
    public void setTotalXP(Integer totalXP) { this.totalXP = totalXP; }

    public Integer getCompletedToday() { return completedToday; }
    public void setCompletedToday(Integer completedToday) { this.completedToday = completedToday; }
}
