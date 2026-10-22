package com.sheetal.habittracker.dto;

public class StatsDto {
    private Integer totalActivity;
    private Integer completedActivity;
    private Integer currentStreak;
    private Integer longestStreak;

    // Constructors
    public StatsDto() {}

    // Getters and Setters
    public Integer getTotalActivity() { return totalActivity; }
    public void setTotalActivity(Integer totalActivity) { this.totalActivity = totalActivity; }
    
    public Integer getCompletedActivity() { return completedActivity; }
    public void setCompletedActivity(Integer completedActivity) { this.completedActivity = completedActivity; }
    
    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }
    
    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }
}
