export default function LeaderboardCard({
    leaders,
    currentUserId,
    currentUserRank,
    currentUserXP,
    onViewAll
  }) {
  
    const getMedal = rank => {
      switch (rank) {
        case 1:
          return "🥇";
        case 2:
          return "🥈";
        case 3:
          return "🥉";
        default:
          return rank;
      }
    };
  
    return (
      <div className="card">
  
        <div className="card-header">
          <h3>Leaderboard</h3>
  
          <span className="trophy">
            🏆
          </span>
        </div>
  
        <div className="leader-list">
  
          {leaders?.map(user => {
  
            const isCurrentUser =
              user.userId === currentUserId;
  
            return (
              <div
                key={user.userId}
                className={
                  `leader-row ${
                    isCurrentUser ? "current-user" : ""
                  }`
                }
              >
  
                <div className="rank">
                  {getMedal(user.rnk)}
                </div>
  
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
  
                <div className="leader-name">
                  {user.name}
  
                  {isCurrentUser && (
                    <span className="you-label">
                      You
                    </span>
                  )}
                </div>
  
                <div className="leader-xp">
                  {user.xp.toLocaleString()} XP
                </div>
  
              </div>
            );
          })}
          {(!leaders || leaders.length === 0) && (
            <div style={{width: '100%', color: 'var(--muted)'}}>
              No contestant completed any Habit
            </div>
          )}
  
        </div>
  
        <div className="your-ranking">
  
          <div>
            <div className="ranking-label">
              Your Rank
            </div>
  
            <strong>
              {`#${(currentUserRank ?? 0)}`}
            </strong>
          </div>
  
          <strong>
            {currentUserXP.toLocaleString()} XP
          </strong>
  
        </div>
        
      </div>
    );
  }