import { supabase, isSupabaseConfigured } from './client';
import {
  CompleteUserProfile,
  MatchingProfileData,
  SaveProfilePayload,
  TeachSkill,
  LearnSkill,
  Profile,
} from '../../types/profile';

const LOCAL_STORAGE_PROFILE_KEY = 'skillmaxx_user_profile';
const LOCAL_STORAGE_GUEST_ID_KEY = 'skillmaxx_current_user_id';

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
 * Fetch a student's complete profile from Supabase with fallback to local cache.
 */
export async function getCompleteProfile(
  userId: string
): Promise<{ data: CompleteUserProfile | null; error: Error | null; isLocalFallback?: boolean }> {
  try {
    // If Supabase credentials are missing or placeholder, directly use local storage
    if (!isSupabaseConfigured()) {
      const localCached = getLocalProfileBackup();
      return { data: localCached, error: null, isLocalFallback: true };
    }

    // 1. Fetch core profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      // Check local storage backup first if Supabase doesn't have the record or errored
      const localCached = getLocalProfileBackup();
      if (
        localCached &&
        (localCached.user_id === userId ||
          userId === '11111111-1111-1111-1111-111111111111' ||
          !localCached.user_id)
      ) {
        return { data: localCached, error: null, isLocalFallback: true };
      }

      if (profileError.code === 'PGRST116') {
        // Record not found in Supabase and no local backup
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

    // Cache to localStorage for instant hydration and offline resilience
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(completeProfile));
    }

    return { data: completeProfile, error: null };
  } catch (err: any) {
    // Graceful offline fallback
    const localCached = getLocalProfileBackup();
    if (localCached) {
      return { data: localCached, error: null, isLocalFallback: true };
    }
    return { data: null, error: err };
  }
}

/**
 * Fetch the authenticated user's profile automatically.
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

  // Guest / local mode: check local profile cache first
  if (typeof window !== 'undefined') {
    const localProfile = getLocalProfileBackup();
    if (localProfile) {
      const guestId = localStorage.getItem(LOCAL_STORAGE_GUEST_ID_KEY) || localProfile.user_id;
      return { data: localProfile, userId: guestId, error: null };
    }
  }

  const resolvedId =
    typeof window !== 'undefined'
      ? localStorage.getItem(LOCAL_STORAGE_GUEST_ID_KEY) || '11111111-1111-1111-1111-111111111111'
      : '11111111-1111-1111-1111-111111111111';

  const { data, error } = await getCompleteProfile(resolvedId);
  return { data, userId: resolvedId, error };
}

/**
 * Save or update student profile data.
 * Validates authenticated user, handles RLS, and guarantees offline persistence.
 */
export async function saveProfile(
  payload: SaveProfilePayload
): Promise<{ success: boolean; error: Error | null; savedLocally?: boolean }> {
  try {
    // 1. Verify authenticated user identity if logged in
    const authUser = await getAuthenticatedUser();
    const targetUserId = authUser?.id || payload.user_id;

    // Enforce matching authenticated user ID to respect RLS
    payload.user_id = targetUserId;

    // Local snapshot first to prevent any data loss on network drops
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(payload));
      localStorage.setItem('skillmaxx_is_onboarded', 'true');
      localStorage.setItem(LOCAL_STORAGE_GUEST_ID_KEY, targetUserId);
    }

    // If Supabase is not configured with real credentials, save locally and succeed cleanly
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
    const { error: deleteTeachError } = await supabase
      .from('user_teach_skills')
      .delete()
      .eq('user_id', targetUserId);

    if (deleteTeachError) {
      console.warn('Supabase teach skills delete error:', deleteTeachError.message);
      return { success: false, error: new Error(deleteTeachError.message), savedLocally: true };
    }

    if (payload.teach_skills.length > 0) {
      const teachRows = payload.teach_skills.map((skill) => ({
        user_id: targetUserId,
        skill_name: skill.skill_name.trim(),
        proficiency: skill.proficiency,
      }));

      const { error: insertTeachError } = await supabase
        .from('user_teach_skills')
        .insert(teachRows);

      if (insertTeachError) {
        return { success: false, error: new Error(insertTeachError.message), savedLocally: true };
      }
    }

    // 4. Synchronize user_learn_skills:
    const { error: deleteLearnError } = await supabase
      .from('user_learn_skills')
      .delete()
      .eq('user_id', targetUserId);

    if (deleteLearnError) {
      return { success: false, error: new Error(deleteLearnError.message), savedLocally: true };
    }

    if (payload.learn_skills.length > 0) {
      const learnRows = payload.learn_skills.map((skill) => ({
        user_id: targetUserId,
        skill_name: skill.skill_name.trim(),
        desired_level: skill.desired_level,
      }));

      const { error: insertLearnError } = await supabase
        .from('user_learn_skills')
        .insert(learnRows);

      if (insertLearnError) {
        return { success: false, error: new Error(insertLearnError.message), savedLocally: true };
      }
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err, savedLocally: true };
  }
}

/**
 * Signs out the current student user and cleans profile caches.
 * Supports the full user lifecycle: onboarding -> save -> logout -> re-login -> reload.
 */
export async function signOutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignore offline signOut errors
  }
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
 * Adapter function provided for Person 4 (Matching Teammate).
 */
export async function getProfilesForMatching(): Promise<{
  data: MatchingProfileData[];
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from('profile_matching_data')
      .select('*')
      .eq('is_onboarded', true);

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    const formatted: MatchingProfileData[] = (data || []).map((row: any) => ({
      user_id: row.user_id,
      full_name: row.full_name,
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

    return { data: formatted, error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
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
