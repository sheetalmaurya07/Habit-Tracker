import React, {useEffect, useState, useMemo } from "react";
import LevelCard from "./LevelCard";
import LeaderboardCard from "./LeaderboardCard";
import BadgesCard from "./BadgesCard";
import API from "../services/api";
import { format } from "date-fns";

const badges = [
  {
    id: 1,
    name: "First Breaking Ground",
    icon: "🌱",
    requirement: "Complete your first habit",
    unlocked: false
  },
  {
    id: 2,
    name: "Deepening Roots",
    icon: "🌿",
    requirement: "Maintain a 7-day streak",
    unlocked: false
  },
  {
    id: 3,
    name: "Diverse Ecosystem",
    icon: "🏡",
    requirement: "Create 5 habits",
    unlocked: false
  },
  {
    id: 4,
    name: "Perennial Blossom",
    icon: "🌸",
    requirement: "Maintain a 30-day streak",
    unlocked: false
  },
  {
    id: 5,
    name: "Centennial Forest",
    icon: "🌳",
    requirement: "Complete 100 habits",
    unlocked: false
  },
];

const levels = [
  {
    levelNumber: 1,
    levelName: 'Dormant Seed',
    levelMinXp: 0,
    levelMaxXp: 99
  },
  {
    levelNumber: 2,
    levelName: 'Fresh Sprout',
    levelMinXp: 100,
    levelMaxXp: 249
  },
  {
    levelNumber: 3,
    levelName: 'Deep Roots',
    levelMinXp: 250,
    levelMaxXp: 499
  },
  {
    levelNumber: 4,
    levelName: 'Flourishing Sapling',
    levelMinXp: 500,
    levelMaxXp: 999
  },
  {
    levelNumber: 5,
    levelName: 'Mighty Oak',
    levelMinXp: 1000,
    levelMaxXp: 99999
  },
];

function GamificationBadge() {
  const [user, setUser] = useState(null);
  const [usersRank, setUsersRank] = useState([]);
  const [data, setData] = useState({
    totalHabits: 0,
    longestStreak: 0,
    totalXP: 0,
    completedToday: 0,
  });

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user")) || null;
    setUser(usr);
  }, []);

  useEffect(() => {
    if(user) {
      try {
        API.get(`/habitpoints/users-rank`)
        .then((response) => setUsersRank(response.data))
        .catch((error) => {
          console.error('Error while fetching leader board data', error);
          alert('Error while fetching leader board data');
        });
      } catch(error) {
        console.error('Error while fetching leader board data', error);
        alert('Error while fetching leader board data');
      }
    }
  }, [user]);

  useEffect(() => {
    if(user) {
      try {
        API.get(`/habits/dashboard?userid=${user.id}&today=${format(new Date(), 'yyyy-MM-dd')}`)
        .then((response) => setData(response.data))
        .catch((error) => {
          console.error('Error while fetching dashboard data', error);
          alert('Error while fetching dashboard data');
        });
      } catch(error) {
        console.error('Error while fetching dashboard data', error);
        alert('Error while fetching dashboard data');
      }
    }
  }, [user]);

  const currentUserRank = useMemo(() => {
    if(usersRank && usersRank.length > 0 && user){
      return usersRank.find(f => f.userId === user.id);
    }
    else 
      return null;
  }, [usersRank, user]);

  const currentUserLevel = useMemo(() => {
    if(currentUserRank){
      console.log('currentUserRank', currentUserRank);
      return levels.find(f => currentUserRank.xp >= f.levelMinXp && currentUserRank.xp <= f.levelMaxXp);
    }
    else 
      return null;
  }, [currentUserRank]);
  
  const userBadges = useMemo(() => {
    if(currentUserRank && data){
      const uBadges = [...badges];

      if((currentUserRank.xp ?? 0)>0)
        uBadges[0].unlocked = true;
      if((data.longestStreak ?? 0)>=7)
        uBadges[1].unlocked = true;
      if((data.totalHabits ?? 0)>=5)
        uBadges[2].unlocked = true;
      if((data.longestStreak ?? 0)>=30)
        uBadges[3].unlocked = true;
      if((currentUserRank.xp ?? 0)>=1000)
        uBadges[4].unlocked = true;
    }
  }, [currentUserRank, data])

  return (
    <div className="main">
      <div data-navbar></div>
      <div className="topbar">
        <div>
          <h1>Gamification 🏆</h1>
          <p className="muted">Turn consistency into rewards.</p>
        </div>
      </div>
      <div className="grid grid-2">
      <LevelCard
          level={currentUserLevel?.levelNumber ?? 1}
          levelName={currentUserLevel?.levelName ?? ''}
          currentXP={currentUserRank?.xp ?? 0}
          levelStartXP={currentUserLevel?.levelMinXp ?? levels[0].levelMinXp}
          nextLevelXP={(currentUserLevel?.levelMaxXp ?? levels[0].levelMaxXp)+1}
        />

        <LeaderboardCard
          leaders={usersRank}
          currentUserId={currentUserRank?.userId ?? 0}
          currentUserRank={currentUserRank?.rnk ?? 0}
          currentUserXP={currentUserRank?.xp ?? 0}
          onViewAll={() =>
            console.log("Go to leaderboard")
          }
        />

      </div>
      <div style={{marginTop:"18px"}}>
      <BadgesCard
          badges={badges}
          onViewAll={() =>
            console.log("Go to badges")
          }
        />
      </div>
    </div>
  );
}

export default GamificationBadge;
