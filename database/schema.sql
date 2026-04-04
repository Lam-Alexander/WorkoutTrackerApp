CREATE TABLE profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_name TEXT NOT NULL,
);

CREATE TABLE workout (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    workout_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE exercise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES workout(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL
);

CREATE TABLE exercise_set (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES exercise(id) ON DELETE CASCADE,
    reps INT NOT NULL,
    weight NUMERIC NOT NULL
);