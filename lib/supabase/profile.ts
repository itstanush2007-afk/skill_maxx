import { supabase, isSupabaseConfigured } from './client';
import {
  CompleteUserProfile,
  MatchingProfileData,
  SaveProfilePayload,
  TeachSkill,
  LearnSkill,
  Profile,
} from '../../types/profile';

export const LOCAL_STORAGE_PROFILE_KEY = 'skillmaxx_user_profile';
export const LOCAL_STORAGE_GUEST_ID_KEY = 'skillmaxx_current_user_id';
export const LOCAL_STORAGE_PROFILES_MAP_KEY = 'skillmaxx_user_profiles_db';
export const LOCAL_STORAGE_ACCOUNTS_KEY = 'skillmaxx_user_accounts_db';

/**
 * Robust UUID generator (RFC 4122 v4)
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Access the multi-user profile database in localStorage
 */
export function getLocalProfilesDatabase(): Record<string, CompleteUserProfile> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILES_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalProfilesDatabase(db: Record<string, CompleteUserProfile>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILES_MAP_KEY, JSON.stringify(db));
  } catch {}
}

/**
 * Access the registered accounts database in localStorage
 */
export function getLocalAccountsDatabase(): Record<string, { userId: string; name: string; email: string }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalAccountsDatabase(
  accounts: Record<string, { userId: string; name: string; email: string }>
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

/**
 * Retrieves the currently authenticated Supabase user.
 * Returns null if not logged in or in local demo mode.
 */
export async function getAuthenticatedUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session?.user || null;
    }
    return user;
  } catch (err) {
    console.warn('Network issue checking Supabase auth status:', err);
    return null;
  }
}

/**
 * Sign in or switch user by email or name.
 * Supports the complete multi-user lifecycle: Rahul, Priya, Aman, Neha, etc.
 */
export function signInWithAccount(emailOrName: string): {
  success: boolean;
  profile: CompleteUserProfile | null;
  userId: string;
} {
  if (typeof window === 'undefined') return { success: false, profile: null, userId: '' };

  const accounts = getLocalAccountsDatabase();
  const profiles = getLocalProfilesDatabase();
  const normalizedKey = emailOrName.trim().toLowerCase();

  let matchedUserId = accounts[normalizedKey]?.userId;
  let matchedProfile = matchedUserId ? profiles[matchedUserId] : null;

  if (!matchedProfile) {
    // Search directly in profiles
    const found = Object.values(profiles).find(
      (p) =>
        (p.email && p.email.toLowerCase() === normalizedKey) ||
        p.full_name.toLowerCase() === normalizedKey
    );
    if (found) {
      matchedUserId = found.user_id;
      matchedProfile = found;
    }
  }

  const userId = matchedUserId || generateUUID();

  // Update active session pointer
  localStorage.setItem(LOCAL_STORAGE_GUEST_ID_KEY, userId);

  if (matchedProfile) {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(matchedProfile));
    localStorage.setItem('skillmaxx_is_onboarded', 'true');
  } else {
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    localStorage.removeItem('skillmaxx_is_onboarded');
    // Save account entry for future lookup
    accounts[normalizedKey] = {
      userId,
      email: normalizedKey.includes('@') ? normalizedKey : '',
      name: emailOrName.trim(),
    };
    saveLocalAccountsDatabase(accounts);
  }

  return {
    success: true,
    profile: matchedProfile || null,
    userId,
  };
}

/**
 * Fetch a student's complete profile from Supabase with fallback to local multi-user store.
 */
export async function getCompleteProfile(
  userId: string
): Promise<{ data: CompleteUserProfile | null; error: Error | null; isLocalFallback?: boolean }> {
  try {
    // If Supabase credentials are missing or placeholder, directly check local database
    if (!isSupabaseConfigured()) {
      const db = getLocalProfilesDatabase();
      const localCached = db[userId] || (getLocalProfileBackup()?.user_id === userId ? getLocalProfileBackup() : null);
      return { data: localCached, error: null, isLocalFallback: true };
    }

    // 1. Fetch core profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      // Check local storage multi-user database first if Supabase doesn't have the record
      const db = getLocalProfilesDatabase();
      const localCached = db[userId] || (getLocalProfileBackup()?.user_id === userId ? getLocalProfileBackup() : null);
      if (localCached) {
        return { data: localCached, error: null, isLocalFallback: true };
      }

      if (profileError.code === 'PGRST116') {
        return { data: null, error: null };
      }

      return { data: null, error: new Error(profileError.message) };
    }

    // 2. Fetch teaching skills
    const { data: teachSkillsData, error: teachError } = await supabase
      .from('user_teach_skills')
      .select('*')
      .eq('user_id', userId);

    if (teachError) {
      return { data: null, error: new Error(teachError.message) };
    }

    // 3. Fetch learning skills
    const { data: learnSkillsData, error: learnError } = await supabase
      .from('user_learn_skills')
      .select('*')
      .eq('user_id', userId);

    if (learnError) {
      return { data: null, error: new Error(learnError.message) };
    }

    const completeProfile: CompleteUserProfile = {
      id: profileData.id,
      user_id: profileData.id,
      full_name: profileData.full_name,
      email: profileData.email,
      department: profileData.department,
      year: profileData.year,
      bio: profileData.bio,
      avatar_url: profileData.avatar_url,
      availability: {
        preferred_days: profileData.preferred_days || [],
        preferred_time: profileData.preferred_time || '',
        mode: profileData.mode || 'hybrid',
      },
      is_onboarded: profileData.is_onboarded,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
      teach_skills: (teachSkillsData as TeachSkill[]) || [],
      learn_skills: (learnSkillsData as LearnSkill[]) || [],
    };

    // Cache locally
    if (typeof window !== 'undefined') {
      const db = getLocalProfilesDatabase();
      db[userId] = completeProfile;
      saveLocalProfilesDatabase(db);
    }

    return { data: completeProfile, error: null };
  } catch (err: any) {
    const db = getLocalProfilesDatabase();
    const localCached = db[userId] || (getLocalProfileBackup()?.user_id === userId ? getLocalProfileBackup() : null);
    if (localCached) {
      return { data: localCached, error: null, isLocalFallback: true };
    }
    return { data: null, error: err };
  }
}

/**
 * Fetch the authenticated or currently active user's profile automatically.
 */
export async function getCurrentUserProfile(): Promise<{
  data: CompleteUserProfile | null;
  userId: string;
  error: Error | null;
}> {
  const user = await getAuthenticatedUser();
  if (user?.id) {
    const { data, error } = await getCompleteProfile(user.id);
    return { data, userId: user.id, error };
  }

  // Guest / local mode: resolve from active user ID
  if (typeof window !== 'undefined') {
    const activeUserId = localStorage.getItem(LOCAL_STORAGE_GUEST_ID_KEY);
    if (activeUserId) {
      const db = getLocalProfilesDatabase();
      if (db[activeUserId]) {
        return { data: db[activeUserId], userId: activeUserId, error: null };
      }
      const { data, error } = await getCompleteProfile(activeUserId);
      if (data) return { data, userId: activeUserId, error };
    }

    const fallback = getLocalProfileBackup();
    if (fallback) {
      return { data: fallback, userId: fallback.user_id, error: null };
    }
  }

  return { data: null, userId: '', error: null };
}

/**
 * Save or update student profile data.
 * Guarantees separate per-user storage: saving User A never modifies User B.
 */
export async function saveProfile(
  payload: SaveProfilePayload
): Promise<{ success: boolean; error: Error | null; savedLocally?: boolean }> {
  try {
    const authUser = await getAuthenticatedUser();
    let targetUserId = authUser?.id || payload.user_id;

    // Guarantee a unique UUID if not yet assigned or if placeholder
    if (!targetUserId || targetUserId === '11111111-1111-1111-1111-111111111111') {
      targetUserId = generateUUID();
    }

    payload.user_id = targetUserId;

    const completeProfile: CompleteUserProfile = {
      id: targetUserId,
      user_id: targetUserId,
      full_name: payload.full_name,
      email: payload.email,
      department: payload.department,
      year: payload.year,
      bio: payload.bio,
      avatar_url: payload.avatar_url,
      availability: payload.availability,
      is_onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      teach_skills: (payload.teach_skills || []).map((s, idx) => ({
        id: `teach-${idx}-${targetUserId}`,
        user_id: targetUserId,
        skill_name: s.skill_name.trim(),
        proficiency: s.proficiency,
      })),
      learn_skills: (payload.learn_skills || []).map((s, idx) => ({
        id: `learn-${idx}-${targetUserId}`,
        user_id: targetUserId,
        skill_name: s.skill_name.trim(),
        desired_level: s.desired_level,
      })),
    };

    // 1. Save strictly to per-user slot in multi-user local database
    if (typeof window !== 'undefined') {
      const db = getLocalProfilesDatabase();
      db[targetUserId] = completeProfile;
      saveLocalProfilesDatabase(db);

      // Register account record by email and name
      const accounts = getLocalAccountsDatabase();
      if (payload.email) {
        accounts[payload.email.toLowerCase().trim()] = {
          userId: targetUserId,
          name: payload.full_name,
          email: payload.email,
        };
      }
      accounts[payload.full_name.toLowerCase().trim()] = {
        userId: targetUserId,
        name: payload.full_name,
        email: payload.email || '',
      };
      saveLocalAccountsDatabase(accounts);

      // Update current active user pointers
      localStorage.setItem(LOCAL_STORAGE_GUEST_ID_KEY, targetUserId);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(completeProfile));
      localStorage.setItem('skillmaxx_is_onboarded', 'true');
    }

    // If Supabase is not configured, local multi-user store save is already complete
    if (!isSupabaseConfigured()) {
      return { success: true, error: null, savedLocally: true };
    }

    // 2. Upsert into Supabase profiles table
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: targetUserId,
        full_name: payload.full_name,
        department: payload.department,
        year: payload.year,
        bio: payload.bio || null,
        avatar_url: payload.avatar_url || null,
        preferred_days: payload.availability.preferred_days,
        preferred_time: payload.availability.preferred_time,
        mode: payload.availability.mode,
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (profileError) {
      console.warn('Supabase profile upsert error:', profileError.message);
      return { success: false, error: new Error(profileError.message), savedLocally: true };
    }

    // 3. Synchronize user_teach_skills:
    await supabase.from('user_teach_skills').delete().eq('user_id', targetUserId);
    if (payload.teach_skills.length > 0) {
      const teachRows = payload.teach_skills.map((skill) => ({
        user_id: targetUserId,
        skill_name: skill.skill_name.trim(),
        proficiency: skill.proficiency,
      }));
      await supabase.from('user_teach_skills').insert(teachRows);
    }

    // 4. Synchronize user_learn_skills:
    await supabase.from('user_learn_skills').delete().eq('user_id', targetUserId);
    if (payload.learn_skills.length > 0) {
      const learnRows = payload.learn_skills.map((skill) => ({
        user_id: targetUserId,
        skill_name: skill.skill_name.trim(),
        desired_level: skill.desired_level,
      }));
      await supabase.from('user_learn_skills').insert(learnRows);
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err, savedLocally: true };
  }
}

/**
 * Signs out the current user session and cleans session caches.
 * Preserves the stored multi-user profile database so peers remain in the matching pool.
 */
export async function signOutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {}
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_GUEST_ID_KEY);
    localStorage.removeItem('skillmaxx_is_onboarded');
    localStorage.removeItem('skillmaxx_onboarding_draft_v1');
  }
}

/**
 * Checks whether a given user has completed their onboarding.
 */
export async function getOnboardingStatus(
  userId: string
): Promise<{ isOnboarded: boolean; error: Error | null }> {
  try {
    if (!isSupabaseConfigured()) {
      const db = getLocalProfilesDatabase();
      const profile = db[userId];
      return { isOnboarded: !!profile?.is_onboarded, error: null };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('is_onboarded')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { isOnboarded: false, error: null };
      return { isOnboarded: false, error: new Error(error.message) };
    }

    return { isOnboarded: !!data?.is_onboarded, error: null };
  } catch (err: any) {
    return { isOnboarded: false, error: err };
  }
}

/**
 * Retrieves all onboarded student profiles in the platform.
 * Reads both Supabase (if configured) and the multi-user local database.
 * Filters out currentUserId to strictly prevent self-matching.
 */
export async function getProfilesForMatching(
  currentUserId?: string
): Promise<{
  data: MatchingProfileData[];
  error: Error | null;
}> {
  let list: MatchingProfileData[] = [];

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profile_matching_data')
        .select('*')
        .eq('is_onboarded', true);

      if (!error && data) {
        list = data.map((row: any) => ({
          user_id: row.user_id,
          full_name: row.full_name,
          email: row.email,
          department: row.department,
          year: row.year,
          bio: row.bio,
          avatar_url: row.avatar_url,
          is_onboarded: row.is_onboarded,
          teachSkills: row.teach_skills || [],
          teachProficiencies: row.teach_proficiencies || [],
          learnSkills: row.learn_skills || [],
          learnDesiredLevels: row.learn_desired_levels || [],
          availability: {
            preferred_days: row.preferred_days || [],
            preferred_time: row.preferred_time || '',
            mode: row.availability_mode || 'hybrid',
          },
        }));
      }
    }
  } catch {}

  // Include multi-user local profiles
  if (typeof window !== 'undefined') {
    const db = getLocalProfilesDatabase();
    for (const p of Object.values(db)) {
      if (!p || !p.user_id || !p.is_onboarded) continue;
      // Do not duplicate if already retrieved from Supabase
      if (!list.some((existing) => existing.user_id === p.user_id)) {
        list.push({
          user_id: p.user_id,
          full_name: p.full_name,
          email: p.email,
          department: p.department,
          year: p.year,
          bio: p.bio || null,
          avatar_url: p.avatar_url || null,
          is_onboarded: p.is_onboarded,
          teachSkills: (p.teach_skills || []).map((s) => s.skill_name),
          teachProficiencies: (p.teach_skills || []).map((s) => s.proficiency),
          learnSkills: (p.learn_skills || []).map((s) => s.skill_name),
          learnDesiredLevels: (p.learn_skills || []).map((s) => s.desired_level),
          availability: p.availability || { preferred_days: [], preferred_time: '', mode: 'hybrid' },
        });
      }
    }
  }

  // Self-match prevention
  if (currentUserId) {
    list = list.filter((p) => p.user_id !== currentUserId);
  }

  return { data: list, error: null };
}

export interface PeerMatchItem {
  id: string;
  name: string;
  department: string;
  matchScore: number;
  avatar: string;
  canTeach: string;
  wantsToLearn: string;
  reviews: string;
  tagline: string;
  skillComp: number;
  availComp: number;
  levelComp: number;
}

/**
 * Calculates reciprocal matching between the current student and all peers in the pool.
 * Evaluates dual-direction complementarity:
 * - Current user learns what Peer teaches
 * - Peer learns what Current user teaches
 */
export function calculateReciprocalMatches(
  currentProfile: CompleteUserProfile | null,
  pool: MatchingProfileData[]
): PeerMatchItem[] {
  if (!currentProfile) return [];

  const curId = currentProfile.user_id || currentProfile.id;
  const curTeaches = (currentProfile.teach_skills || []).map((s) => s.skill_name.trim().toLowerCase());
  const curLearns = (currentProfile.learn_skills || []).map((s) => s.skill_name.trim().toLowerCase());

  // Filter out current user (self-match prevention)
  const eligiblePeers = pool.filter((p) => p.user_id !== curId);

  const results: PeerMatchItem[] = [];

  for (const peer of eligiblePeers) {
    const peerTeaches = (peer.teachSkills || []).map((s) => s.trim().toLowerCase());
    const peerLearns = (peer.learnSkills || []).map((s) => s.trim().toLowerCase());

    // Check reciprocal skill overlaps
    const userLearnsWhatPeerTeaches = curLearns.filter((want) =>
      peerTeaches.some((teach) => teach.includes(want) || want.includes(teach))
    );

    const peerLearnsWhatUserTeaches = peerLearns.filter((want) =>
      curTeaches.some((teach) => teach.includes(want) || want.includes(teach))
    );

    const isReciprocal = userLearnsWhatPeerTeaches.length > 0 && peerLearnsWhatUserTeaches.length > 0;
    const isOneWay = userLearnsWhatPeerTeaches.length > 0 || peerLearnsWhatUserTeaches.length > 0;

    let score = 65;
    let tagline = 'Campus peer with shared learning goals.';

    if (isReciprocal) {
      score = 90 + Math.min(8, (userLearnsWhatPeerTeaches.length + peerLearnsWhatUserTeaches.length) * 4);
      tagline = `Mutual skill exchange: they teach ${peer.teachSkills.slice(0, 1).join('')}, you teach ${curTeaches.slice(0, 1).join('')}.`;
    } else if (userLearnsWhatPeerTeaches.length > 0) {
      score = 80 + Math.min(8, userLearnsWhatPeerTeaches.length * 4);
      tagline = `Peer mentorship: excels in ${peer.teachSkills.slice(0, 2).join(', ')}.`;
    } else if (peerLearnsWhatUserTeaches.length > 0) {
      score = 75 + Math.min(8, peerLearnsWhatUserTeaches.length * 4);
      tagline = `Eager to learn from your ${currentProfile.teach_skills?.[0]?.skill_name || 'skills'}.`;
    }

    const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(peer.full_name)}`;

    results.push({
      id: peer.user_id,
      name: peer.full_name,
      department: `${peer.department || 'Computer Science'} · ${peer.year || 'Student'}`,
      matchScore: score,
      avatar: peer.avatar_url || defaultAvatar,
      canTeach: peer.teachSkills.length > 0 ? peer.teachSkills.join(', ') : 'Various skills',
      wantsToLearn: peer.learnSkills.length > 0 ? peer.learnSkills.join(', ') : 'Technology',
      reviews: '4.9 · 15 reviews',
      tagline,
      skillComp: score,
      availComp: 92,
      levelComp: 94,
    });
  }

  // Sort descending by matchScore
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Helper to retrieve local profile backup from localStorage
 */
function getLocalProfileBackup(): CompleteUserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (!local) return null;
    const p = JSON.parse(local);
    return {
      id: p.user_id || '11111111-1111-1111-1111-111111111111',
      user_id: p.user_id || '11111111-1111-1111-1111-111111111111',
      full_name: p.full_name || '',
      email: p.email,
      department: p.department || '',
      year: p.year || '',
      bio: p.bio || '',
      avatar_url: p.avatar_url || '',
      availability: p.availability || { preferred_days: [], preferred_time: '', mode: 'hybrid' },
      is_onboarded: true,
      teach_skills: p.teach_skills || [],
      learn_skills: p.learn_skills || [],
    };
  } catch (e) {
    return null;
  }
}
