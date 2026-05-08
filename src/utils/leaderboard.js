const LEADERBOARD_KEY = 'jobtracker_leaderboard_v1';

const parseEntries = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadLeaderboardEntries = () => {
  try {
    return parseEntries(localStorage.getItem(LEADERBOARD_KEY))
      .map((entry) => ({
        ...entry,
        userId: entry.userId || entry.id || entry.user_id || entry.email || entry.nickname,
        applications: Number(entry.applications) || 0,
      }))
      .sort((left, right) => right.applications - left.applications || new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime());
  } catch {
    return [];
  }
};

export const saveLeaderboardEntries = (entries) => {
  const normalized = [...entries].sort((left, right) => right.applications - left.applications || new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime());
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(normalized));
  return normalized;
};

export const upsertLeaderboardEntry = ({ userId, email, nickname, applications }) => {
  const entries = loadLeaderboardEntries();
  const safeNickname = nickname || email || 'Anonymous';
  const now = new Date().toISOString();
  const existingIndex = entries.findIndex((entry) => entry.userId === userId || entry.email === email || entry.nickname === safeNickname);

  const nextEntry = {
    userId: userId || email || safeNickname,
    email: email || '',
    nickname: safeNickname,
    applications: Number(applications) || 0,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt || now : now,
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = nextEntry;
  } else {
    entries.push(nextEntry);
  }

  return saveLeaderboardEntries(entries);
};

export const syncCurrentUserLeaderboardEntry = (user, applications) => {
  if (!user) return loadLeaderboardEntries();

  const nickname = user.nickname || user.full_name || user.username || user.user_metadata?.nickname || user.email || 'Anonymous';
  return upsertLeaderboardEntry({
    userId: user.id || user.user_id || user.userId,
    email: user.email || user.username || '',
    nickname,
    applications,
  });
};