-- ==============================================================================
-- SkillMaxx: Profile & Onboarding Database Schema
-- Module: Profile & Onboarding (Person 3)
-- Conventions: PostgreSQL with Supabase RLS, foreign keys to auth.users
-- ==============================================================================

-- 1. PROFILES TABLE
-- Core student profile containing identity, academic info, and availability.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    -- Availability attributes
    preferred_days TEXT[] NOT NULL DEFAULT '{}',
    preferred_time TEXT,             -- e.g. 'Morning', 'Afternoon', 'Evening', 'Flexible'
    mode TEXT NOT NULL DEFAULT 'hybrid' CHECK (mode IN ('online', 'in-person', 'hybrid')),
    -- Onboarding completion flag
    is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TEACHING SKILLS TABLE
-- Skills the student can teach to peers, along with verified/claimed proficiency.
CREATE TABLE IF NOT EXISTS public.user_teach_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    proficiency TEXT NOT NULL CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_teach_skill UNIQUE (user_id, skill_name)
);

-- 3. LEARNING SKILLS TABLE
-- Skills the student wants to learn from peers, along with target desired level.
CREATE TABLE IF NOT EXISTS public.user_learn_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    desired_level TEXT NOT NULL CHECK (desired_level IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_learn_skill UNIQUE (user_id, skill_name)
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_is_onboarded ON public.profiles(is_onboarded);
CREATE INDEX IF NOT EXISTS idx_user_teach_skills_user ON public.user_teach_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_teach_skills_skill ON public.user_teach_skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_user_learn_skills_user ON public.user_learn_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learn_skills_skill ON public.user_learn_skills(skill_name);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_teach_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learn_skills ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by all authenticated users"
    ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Teaching Skills Policies
CREATE POLICY "Teaching skills are viewable by all authenticated users"
    ON public.user_teach_skills
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own teaching skills"
    ON public.user_teach_skills
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teaching skills"
    ON public.user_teach_skills
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teaching skills"
    ON public.user_teach_skills
    FOR DELETE
    USING (auth.uid() = user_id);

-- Learning Skills Policies
CREATE POLICY "Learning skills are viewable by all authenticated users"
    ON public.user_learn_skills
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own learning skills"
    ON public.user_learn_skills
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning skills"
    ON public.user_learn_skills
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning skills"
    ON public.user_learn_skills
    FOR DELETE
    USING (auth.uid() = user_id);

-- 6. MATCHING INTEGRATION VIEW
-- Aggregated view designed specifically for Person 4 (Matching Engine)
-- Provides arrays of teachSkills, learnSkills, proficiency, and availability
CREATE OR REPLACE VIEW public.profile_matching_data AS
SELECT 
    p.id AS user_id,
    p.full_name,
    p.department,
    p.year,
    p.bio,
    p.avatar_url,
    p.is_onboarded,
    p.preferred_days,
    p.preferred_time,
    p.mode AS availability_mode,
    COALESCE(
        (SELECT array_agg(t.skill_name) FROM public.user_teach_skills t WHERE t.user_id = p.id),
        ARRAY[]::TEXT[]
    ) AS teach_skills,
    COALESCE(
        (SELECT array_agg(t.proficiency) FROM public.user_teach_skills t WHERE t.user_id = p.id),
        ARRAY[]::TEXT[]
    ) AS teach_proficiencies,
    COALESCE(
        (SELECT array_agg(l.skill_name) FROM public.user_learn_skills l WHERE l.user_id = p.id),
        ARRAY[]::TEXT[]
    ) AS learn_skills,
    COALESCE(
        (SELECT array_agg(l.desired_level) FROM public.user_learn_skills l WHERE l.user_id = p.id),
        ARRAY[]::TEXT[]
    ) AS learn_desired_levels
FROM public.profiles p;

-- 7. AUTO-UPDATE TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
