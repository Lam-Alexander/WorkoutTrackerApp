-- =====================================================
-- Intial Database Schema
-- Workout Tracking Application
-- =====================================================
CREATE TABLE profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_name TEXT NOT NULL
);

CREATE TABLE workout_template (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    workout_template_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE exercise_template (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_template_id UUID NOT NULL REFERENCES workout_template(id) ON DELETE CASCADE,
    exercise_template_name TEXT NOT NULL,
    exercise_template_order_idx INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE workout_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    workout_template_id UUID NOT NULL REFERENCES workout_template(id) ON DELETE CASCADE,
    workout_date  DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE exercise_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_log_id UUID NOT NULL REFERENCES workout_log(id) ON DELETE CASCADE,
    exercise_template_id UUID NOT NULL REFERENCES exercise_template(id) ON DELETE CASCADE,
    exercise_log_order_idx INT NOT NULL
);

CREATE TABLE sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_log_id UUID NOT NULL REFERENCES exercise_log(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    reps INT NOT NULL,
    weights NUMERIC NOT NULL,
    set_order_idx INT NOT NULL
);


-- =====================================================
-- Schema Update
-- Added validation to prevent empty exercise names
-- Empty strings ('') and whitespace-only strings ('   ')
-- are now rejected at the database level
-- =====================================================
ALTER TABLE workout_template 
ADD CONSTRAINT exercise_template_name_not_empty
CHECK (length(trim(exercise_template_name)) > 0)


-- =====================================================
-- Schema Update
-- Added icon column for workout template
-- =====================================================
ALTER TABLE workout_template
ADD COLUMN workout_template_icon TEXT;



-- =====================================================
-- Schema Update
-- Added target for exercise template to track workout targets.
-- =====================================================
ALTER TABLE exercise_template
ADD COLUMN target_scheme TEXT;