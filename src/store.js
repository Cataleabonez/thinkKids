// Global state stored in localStorage so progress persists between sessions.
// All components read/write through these helpers.

const KEY = 'thinkkids_state';

const defaultState = {
  // child profile
  childName: '',
  age: null,
  ageTier: null,      // '4-5' | '6-8' | '9-10'
  avatarId: 'fox',
  // progress
  totalStars: 0,
  level: 1,
  streakDays: 0,
  lastPlayDate: null,
  // per-activity stars  { activityId: 0|1|2|3 }
  activityStars: {},
  // earned badge ids
  earnedBadges: [],
  // parent dashboard PIN (simple 4-digit string)
  parentPin: '',
  // onboarding done?
  onboarded: false,
};

export function getState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function setState(partial) {
  const current = getState();
  const next = { ...current, ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function resetState() {
  localStorage.removeItem(KEY);
}

// Stars needed to reach each level (cumulative)
const LEVEL_THRESHOLDS = [0,10,25,45,70,100,135,175,220,270,325,385,450,520,595,675,760,850,945,1050];

export function levelFromStars(stars) {
  let lvl = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (stars >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
    else break;
  }
  return Math.min(lvl, 20);
}

export function starsForNextLevel(currentLevel) {
  return LEVEL_THRESHOLDS[Math.min(currentLevel, 19)] ?? 1050;
}

// Determine age tier from numeric age
export function tierFromAge(age) {
  if (age <= 5) return '4-5';
  if (age <= 8) return '6-8';
  return '9-10';
}

// Check if today is a new day vs lastPlayDate; update streak accordingly
export function updateStreak() {
  const state = getState();
  const today = new Date().toDateString();
  if (state.lastPlayDate === today) return state; // already played today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = state.lastPlayDate === yesterday ? (state.streakDays || 0) + 1 : 1;
  return setState({ streakDays: newStreak, lastPlayDate: today });
}
