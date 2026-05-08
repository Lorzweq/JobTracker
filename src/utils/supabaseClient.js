import { createClient } from '@supabase/supabase-js';
import { generateNickname } from './nickname';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const supabaseUrl = rawSupabaseUrl?.replace(/\/rest\/v1\/?$/, '');
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials not configured. Auth features will be unavailable.');
}

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

// Domain to synthesize for username-only signups. Use example.com by default.
const DEFAULT_LOCAL_EMAIL_DOMAIN = import.meta.env.VITE_LOCAL_EMAIL_DOMAIN || 'example.com';

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
};

const normalizeAuthUser = (user) => {
  if (!user) return null;

  const normalizedId = user.id || user.user_id || user.userId || null;
  const normalizedUsername = user.username || user.user_username || user.user_name || user.email || '';
  const normalizedNickname = user.nickname || user.user_nickname || user.full_name || user.user_full_name || normalizedUsername;
  const normalizedFullName = user.full_name || user.user_full_name || normalizedNickname;
  const normalizedAvatarUrl = user.avatar_url || user.user_avatar_url || null;
  const normalizedCreatedAt = user.created_at || user.user_created_at || null;

  return {
    ...user,
    id: normalizedId,
    userId: normalizedId,
    username: normalizedUsername,
    nickname: normalizedNickname,
    full_name: normalizedFullName,
    avatar_url: normalizedAvatarUrl,
    created_at: normalizedCreatedAt,
  };
};

// Build profile payload from a user object returned by your RPC
const buildProfilePayload = (user, overrides = {}) => {
  const nickname = overrides.nickname || user?.nickname || generateNickname(user?.username || user?.id || 'jobseeker');
  const fullName = overrides.fullName || nickname;
  const avatarUrl = overrides.avatarUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(nickname)}`;

  return {
    id: user.id,
    username: user.username,
    full_name: fullName,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  };
};

// Upsert profile (create/update) using the profiles table
export const upsertProfileForUser = async (user, overrides = {}) => {
  ensureSupabase();

  if (!user?.id) return null;

  // Prepare the parameters for the upsert_profile function
  const nickname = overrides.nickname || user?.nickname || user?.username || 'jobseeker';
  const fullName = overrides.fullName || nickname;
  const avatarUrl = overrides.avatarUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(nickname)}`;
  // Prefer calling DB RPC `upsert_profile` so server-side logic (triggers, defaults)
  // can be centralized in the database. If the RPC is not available, fall back
  // to a direct upsert into `profiles`.
  try {
    const { data, error } = await supabase.rpc('upsert_profile', {
      p_id: user.id,
      p_username: user.username,
      p_full_name: fullName,
      p_avatar_url: avatarUrl,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    // Fallback to direct table upsert
    const payload = buildProfilePayload({
      id: user.id,
      username: user.username,
      nickname,
    }, { fullName, avatarUrl });
    const { data, error } = await supabase.from('profiles').upsert(payload).select();
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }
};

// ============================================
// Main username/password authentication (via RPC)
// ============================================

/**
 * Register a new user with username + password.
 * Calls the database function `register_user`.
 * Expected to return the new user object (with id, username, maybe a session token).
 */
// In supabaseClient.js – registerUser
export async function registerUser(username, password, nickname = null, fullName = null) {
  ensureSupabase();

  // Use DB RPC `register_user` which performs secure password hashing and
  // creates the application user and related profile rows.
  try {
    const { data, error } = await supabase.rpc('register_user', {
      p_username: username,
      p_password: password,
      p_nickname: nickname,
      p_full_name: fullName,
    });
    if (error) throw error;
    return normalizeAuthUser(Array.isArray(data) ? data[0] : data);
  } catch (err) {
    console.error('register_user RPC error:', err);
    throw err;
  }
}

/**
 * Authenticate a user with username + password.
 * Calls the database function `authenticate_user`.
 * Expected to return the user object (with id, username, and possibly a session token).
 */
export const authenticateUser = async (username, password) => {
  ensureSupabase();

  // Use DB RPC `authenticate_user` which verifies password hash inside DB and
  // returns the user record on success.
  try {
    const { data, error } = await supabase.rpc('authenticate_user', {
      p_username: username,
      p_password: password,
    });
    if (error) throw error;
    const user = normalizeAuthUser(Array.isArray(data) ? data[0] : data);
    return user || null;
  } catch (err) {
    console.error('authenticate_user RPC error:', err);
    throw err;
  }
};

// ============================================
// Session management (if using custom sessions)
// ============================================
// Store user in localStorage for session persistence
export const setSession = (user) => {
  const normalizedUser = normalizeAuthUser(user);
  if (normalizedUser?.id) {
    // Store user data for session restoration
    localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
  }
};

export const getSession = () => {
  const user = localStorage.getItem('auth_user');
  if (user) {
    try {
      return { user: JSON.parse(user) };
    } catch { return null; }
  }
  return null;
};

export const clearSession = () => {
  localStorage.removeItem('auth_session');
  localStorage.removeItem('auth_user');
};

// Sign out helper - attempts Supabase auth sign out then clears local session
export const signOut = async () => {
  try {
    if (supabase && typeof supabase.auth?.signOut === 'function') {
      await supabase.auth.signOut();
    }
  } catch (err) {
    // non-fatal: log and continue to clear local session
    console.warn('Supabase signOut failed:', err);
  }
  clearSession();
};

// ============================================
// Helper to get current user from stored session (no backend call)
export const getCurrentUser = async () => {
  const session = getSession();
  return normalizeAuthUser(session?.user) || null;
};

// Optional: function to verify session with backend (if you have a /verify endpoint)
export const verifySession = async (token) => {
  // Example: call a custom RPC or REST endpoint to validate token
  // If not implemented, just rely on local storage.
  return true;
};

// ============================================
// Optional: Keep email-based functions for legacy compatibility
// (but we comment them out because you don't use them)
/*
export const signUp = async (email, password) => { ... };
export const signIn = async (email, password) => { ... };
export const signOut = async () => { ... };
export const onAuthStateChange = (callback) => { ... };
*/