/**
 * SkillMaxx - Profile & Onboarding Data Model Types
 * Module: Profile & Onboarding
 * Compatible with Person 4 (Matching Engine) and Person 5 (Project Builder)
 */

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';
export type DesiredLevel = 'beginner' | 'intermediate' | 'advanced';
export type AvailabilityMode = 'online' | 'in-person' | 'hybrid';

/**
 * Weekly schedule availability representation
 */
export interface Availability {
  preferred_days: string[]; // e.g. ['Monday', 'Wednesday', 'Saturday']
  preferred_time: string;   // e.g. 'Morning (9AM-12PM)', 'Evening (6PM-9PM)', 'Flexible'
  mode: AvailabilityMode;    // 'online' | 'in-person' | 'hybrid'
}

/**
 * Skills the student is capable of teaching to peers
 */
export interface TeachSkill {
  id?: string;
  user_id?: string;
  skill_name: string;
  proficiency: ProficiencyLevel;
  created_at?: string;
}

/**
 * Skills the student seeks to learn from peers
 */
export interface LearnSkill {
  id?: string;
  user_id?: string;
  skill_name: string;
  desired_level: DesiredLevel;
  created_at?: string;
}

/**
 * Core User Profile model (maps to Supabase `profiles` table)
 */
export interface Profile {
  id: string;               // UUID mapped to auth.users.id
  user_id: string;          // Alias for id to ensure multi-module compatibility
  full_name: string;
  email?: string;
  department: string;       // e.g. 'Computer Science', 'Electronics', 'Information Technology'
  year: string;             // e.g. '1st Year', '2nd Year', '3rd Year', '4th Year'
  bio?: string | null;
  avatar_url?: string | null;
  availability: Availability;
  is_onboarded: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Complete Student Profile containing both academic data and full skill lists
 */
export interface CompleteUserProfile extends Profile {
  teach_skills: TeachSkill[];
  learn_skills: LearnSkill[];
}

/**
 * Lightweight, optimized structure consumed by Person 4 (Matching Engine)
 * Exposes teachSkills[], learnSkills[], proficiency[], and availability[]
 */
export interface MatchingProfileData {
  user_id: string;
  full_name: string;
  email?: string;
  department: string;
  year: string;
  bio: string | null;
  avatar_url: string | null;
  is_onboarded: boolean;
  teachSkills: string[];              // ['Python', 'DSA', 'Docker']
  teachProficiencies: ProficiencyLevel[]; // ['advanced', 'intermediate', 'intermediate']
  learnSkills: string[];              // ['UI/UX', 'Figma', 'System Design']
  learnDesiredLevels: DesiredLevel[]; // ['intermediate', 'beginner', 'advanced']
  availability: Availability;
}

/**
 * Payload submitted during onboarding or profile editing
 */
export interface SaveProfilePayload {
  user_id: string;
  full_name: string;
  email?: string;
  department: string;
  year: string;
  bio?: string;
  avatar_url?: string;
  availability: Availability;
  teach_skills: Array<{
    skill_name: string;
    proficiency: ProficiencyLevel;
  }>;
  learn_skills: Array<{
    skill_name: string;
    desired_level: DesiredLevel;
  }>;
}

export interface CompletenessItem {
  id: string;
  label: string;
  completed: boolean;
  weight: number;
}

/**
 * Calculates Profile Completeness strictly derived from real profile fields.
 * Weight distributed across: Full Name (15%), Department (15%), Year (15%),
 * Bio (15%), Teach Skills (15%), Learn Skills (15%), Availability & Slot (10%).
 */
export function calculateProfileCompleteness(data: {
  full_name?: string | null;
  department?: string | null;
  year?: string | null;
  bio?: string | null;
  teach_skills?: Array<any> | null;
  learn_skills?: Array<any> | null;
  availability?: Availability | null;
}): { score: number; items: CompletenessItem[] } {
  const checks: CompletenessItem[] = [
    {
      id: 'name',
      label: 'Full Name',
      completed: !!(data.full_name && data.full_name.trim().length >= 2),
      weight: 15,
    },
    {
      id: 'dept',
      label: 'Academic Department',
      completed: !!(data.department && data.department.trim().length > 0),
      weight: 15,
    },
    {
      id: 'year',
      label: 'Year of Study',
      completed: !!(data.year && data.year.trim().length > 0),
      weight: 15,
    },
    {
      id: 'bio',
      label: 'Personal Bio',
      completed: !!(data.bio && data.bio.trim().length >= 10),
      weight: 15,
    },
    {
      id: 'teach',
      label: 'Skills to Teach',
      completed: (data.teach_skills?.length || 0) >= 1,
      weight: 15,
    },
    {
      id: 'learn',
      label: 'Skills to Learn',
      completed: (data.learn_skills?.length || 0) >= 1,
      weight: 15,
    },
    {
      id: 'avail',
      label: 'Availability & Slot',
      completed:
        (data.availability?.preferred_days?.length || 0) >= 1 &&
        Boolean(data.availability?.preferred_time),
      weight: 10,
    },
  ];

  const score = checks.reduce(
    (acc, curr) => (curr.completed ? acc + curr.weight : acc),
    0
  );

  return {
    score,
    items: checks,
  };
}
