export default function LeaderboardPage({ entries, currentUserId, t }) {
  const sortedEntries = [...entries].sort((left, right) => {
    if (right.applications !== left.applications) {
      return right.applications - left.applications;
    }

    return new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime();
  });

  const currentIndex = sortedEntries.findIndex((entry) => entry.userId === currentUserId);
  const currentRank = currentIndex >= 0 ? currentIndex + 1 : null;
  const topThree = sortedEntries.slice(0, 3);

  return (
    <section className="leaderboard-page">
      <div className="leaderboard-shell">
        <div className="leaderboard-hero">
          <div>
            <p className="section-kicker">{t('leaderboard')}</p>
            <h2>{t('leaderboardTitle')}</h2>
            <p className="leaderboard-description">{t('leaderboardDesc')}</p>
          </div>

          {currentRank && (
            <div className="leaderboard-current-card">
              <span className="leaderboard-current-label">{t('yourRank')}</span>
              <strong>#{currentRank}</strong>
            </div>
          )}
        </div>

        <div className="leaderboard-podium">
          {topThree.map((entry, index) => (
            <article key={entry.userId} className={`podium-card podium-${index + 1}`}>
              <span className="podium-rank">#{index + 1}</span>
              <strong className="podium-nickname">{entry.nickname}</strong>
              <span className="podium-apps">{entry.applications} {t('applications')}</span>
            </article>
          ))}
        </div>

        <div className="leaderboard-table">
          <div className="leaderboard-row leaderboard-row-head">
            <span>{t('rank')}</span>
            <span>{t('nickname')}</span>
            <span>{t('applications')}</span>
          </div>

          {sortedEntries.length === 0 ? (
            <div className="leaderboard-empty">{t('leaderboardEmpty')}</div>
          ) : (
            sortedEntries.map((entry, index) => (
              <div
                key={entry.userId}
                className={`leaderboard-row ${entry.userId === currentUserId ? 'leaderboard-row-current' : ''}`}
              >
                <span>#{index + 1}</span>
                <span className="leaderboard-name">{entry.nickname}</span>
                <span>{entry.applications}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}