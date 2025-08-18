-- Labchain App Database Schema
-- Tables for social worker counseling app with AI guidance

-- Social workers table
CREATE TABLE social_workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Elderly clients table
CREATE TABLE elderly_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_relationship VARCHAR(50),
    photo_url TEXT,
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Counseling appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    social_worker_id UUID REFERENCES social_workers(id) ON DELETE CASCADE,
    client_id UUID REFERENCES elderly_clients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    location VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Counseling sessions table
CREATE TABLE counseling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    social_worker_id UUID REFERENCES social_workers(id) ON DELETE CASCADE,
    client_id UUID REFERENCES elderly_clients(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    session_goals TEXT[],
    session_notes TEXT,
    counselor_observations TEXT,
    session_summary TEXT,
    next_session_recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emotional state records table
CREATE TABLE emotional_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    client_id UUID REFERENCES elderly_clients(id) ON DELETE CASCADE,
    depression_level INTEGER CHECK (depression_level >= 1 AND depression_level <= 10),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    loneliness_level INTEGER CHECK (loneliness_level >= 1 AND loneliness_level <= 10),
    anger_level INTEGER CHECK (anger_level >= 1 AND anger_level <= 10),
    overall_mood VARCHAR(50),
    additional_notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI guidance records table
CREATE TABLE ai_guidance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    client_id UUID REFERENCES elderly_clients(id) ON DELETE CASCADE,
    guidance_type VARCHAR(50) NOT NULL, -- 'conversation_topics', 'emotional_check', 'care_points', 'activities'
    guidance_content JSONB NOT NULL,
    priority_level VARCHAR(20) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    is_used BOOLEAN DEFAULT FALSE,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session progress tracking table
CREATE TABLE session_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES counseling_sessions(id) ON DELETE CASCADE,
    progress_stage VARCHAR(50) NOT NULL, -- 'rapport_building', 'emotional_expression', 'coping_strategies', 'family_connection'
    completion_status VARCHAR(20) DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
    stage_notes TEXT,
    time_spent_minutes INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_social_worker ON appointments(social_worker_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_sessions_date ON counseling_sessions(session_date);
CREATE INDEX idx_sessions_client ON counseling_sessions(client_id);
CREATE INDEX idx_emotional_states_client ON emotional_states(client_id);
CREATE INDEX idx_emotional_states_recorded_at ON emotional_states(recorded_at);
CREATE INDEX idx_ai_guidance_session ON ai_guidance(session_id);
CREATE INDEX idx_ai_guidance_priority ON ai_guidance(priority_level);
