package com.sheetal.habittracker.service;

import com.sheetal.habittracker.entity.*;
import com.sheetal.habittracker.projection.*;
import com.sheetal.habittracker.repository.HabitPointRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitPointService {
    private final HabitPointRepository habitPointRepository;
    public HabitPointService(HabitPointRepository habitPointRepository) { this.habitPointRepository = habitPointRepository; }
    
    public List<HabitPoint> getAllHabitPoints() { return habitPointRepository.findAll(); }
    public HabitPoint saveHabitPoint(HabitPoint habitPoint) { return habitPointRepository.save(habitPoint); }

    public List<HabitPointStatusProjection> getHabitPointStatusesByDate(Long userId, LocalDate sDate) 
    { 
        return habitPointRepository.findHabitPointStatusesByDate(userId, sDate); 
    }

    public List<HabitPoint> getCompletedHabitPointsByUserId(Long userId) 
    { 
        return habitPointRepository.findCompletedHabitPointsByUserId(userId); 
    }

    public List<HabitPointCompletedDatesProjection> getCompletedDatesByHabitId(Long habitId) 
    { 
        return habitPointRepository.findCompletedDatesByHabitId(habitId); 
    }

    public List<HabitPointRecordProjection> getHabitPointsByDate(Long userId, LocalDate fromDate, LocalDate toDate) 
    { 
        return habitPointRepository.findHabitPointsByDate(userId, fromDate, toDate); 
    }

    public List<UserRankProjection> getUsersRank() 
    { 
        return habitPointRepository.findUsersRank(); 
    }
}
