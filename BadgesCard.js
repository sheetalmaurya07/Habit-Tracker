export default function BadgesCard({
    badges,
    onViewAll
  }) {
  
    const unlockedCount =
      badges.filter(x => x.unlocked).length;
  
    return (
      <div className="card">
  
        <div className="card-header">
          <h3>Badges</h3>
  
          <span>
            🏅
          </span>
        </div>
  
        <div className="badges-grid">
  
          {badges.map(badge => (
  
            <div
              key={badge.id}
              className={
                `badge-item ${
                  badge.unlocked
                    ? "badge-unlocked"
                    : "badge-locked"
                }`
              }
              title={
                badge.unlocked
                  ? badge.name
                  : badge.requirement
              }
            >
  
              <div className="badge-icon">
                {badge.unlocked
                  ? badge.icon
                  : "🔒"}
              </div>
  
              <div className="badge-name">
                {badge.name}
              </div>
  
            </div>
  
          ))}
  
        </div>
  
        <div className="badge-summary">
  
          <strong>
            {unlockedCount} of {badges.length}
          </strong>
  
          <span> badges unlocked</span>
  
        </div>
      </div>
    );
  }
  