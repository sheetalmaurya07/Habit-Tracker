package com.sheetal.habittracker.service;

import com.sheetal.habittracker.entity.*;
import com.sheetal.habittracker.projection.*;
import com.sheetal.habittracker.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HabitService {
    private final HabitRepository habitRepository;
    public HabitService(HabitRepository habitRepository) { this.habitRepository = habitRepository; }

    public List<Habit> getAllHabits() { return habitRepository.findAll(); }
    public Habit saveHabit(Habit habit) { return habitRepository.save(habit); }
    
    public Habit updateHabit(Habit habit) 
    { 
        Optional<Habit> habitOpt = habitRepository.findById(habit.getId());

        if (habitOpt.isPresent()) {
            Habit hbt = habitOpt.get();
             
            hbt.setHabitName(habit.getHabitName());
            hbt.setTargetValue(habit.getTargetValue());
            hbt.setTargetUnit(habit.getTargetUnit());
            
            return habitRepository.save(hbt); 
        }

        return null; 
    }

    public Boolean deleteHabit(Habit habit) 
    { 
        Optional<Habit> habitOpt = habitRepository.findById(habit.getId());

        if (habitOpt.isPresent()) {
            Habit hbt = habitOpt.get();
             
            hbt.setEndDate(habit.getEndDate());
            hbt.setStatus("INACTIVE");
            hbt.setArchivedAt(habit.getArchivedAt());
            
            habitRepository.save(hbt); 
            return true;
        }

        return false; 
    }

    public List<HabitTrackerProjection> getHabitTracker(Long userId, LocalDate fromDate, LocalDate toDate)
    {
        return habitRepository.findHabitTracker(userId, fromDate, toDate);
    }
}
