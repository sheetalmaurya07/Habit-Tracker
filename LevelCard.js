export default function LevelCard({
    level,
    levelName,
    currentXP,
    levelStartXP,
    nextLevelXP
  }) {
    
    const xpInCurrentLevel = currentXP - levelStartXP;
    const xpRequired =
      nextLevelXP - levelStartXP;
  
    const progress =
      (xpInCurrentLevel / xpRequired) * 100;
  
    const remainingXP =
      nextLevelXP - currentXP;
  
    return (
      <div className="card">
  
        <div className="card-header">
          <h3>Your Level & XP</h3>
          <span className="level-icon">⭐</span>
        </div>
  
        <div className="level-info">
  
          <div className="level-circle">
            {level}
          </div>
  
          <div>
            <div className="level-title">
              Level {level}
            </div>
  
            <div className="level-name">
              {levelName}
            </div>
          </div>
  
        </div>
  
        <div className="xp-values">
          <span>{currentXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
  
        <div className="progress-track">
  
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(progress, 100)}%`
            }}
          />
  
        </div>
  
        <div className="xp-message">
          {remainingXP} XP to Level {level + 1}
        </div>
  
      </div>
    );
  }