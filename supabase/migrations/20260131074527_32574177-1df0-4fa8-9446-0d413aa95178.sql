-- Create enum for sports
CREATE TYPE public.sport_type AS ENUM ('volleyball', 'basketball', 'football', 'badminton', 'cricket');

-- Create enum for match status
CREATE TYPE public.match_status AS ENUM ('upcoming', 'live', 'halftime', 'break', 'finished');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create matches table (stores all match data including embedded team info)
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport public.sport_type NOT NULL,
    
    -- Team 1 info
    team1_name TEXT NOT NULL,
    team1_color TEXT DEFAULT '#3B82F6',
    team1_score INTEGER DEFAULT 0,
    team1_players JSONB DEFAULT '[]'::jsonb,
    
    -- Team 2 info
    team2_name TEXT NOT NULL,
    team2_color TEXT DEFAULT '#EF4444',
    team2_score INTEGER DEFAULT 0,
    team2_players JSONB DEFAULT '[]'::jsonb,
    
    -- Cricket specific
    team1_wickets INTEGER DEFAULT 0,
    team2_wickets INTEGER DEFAULT 0,
    team1_overs NUMERIC(5,1) DEFAULT 0,
    team2_overs NUMERIC(5,1) DEFAULT 0,
    current_batting_team INTEGER DEFAULT 1,
    
    -- Volleyball/Badminton specific (sets)
    team1_sets INTEGER DEFAULT 0,
    team2_sets INTEGER DEFAULT 0,
    current_set INTEGER DEFAULT 1,
    
    -- Basketball/Football specific (quarters/halves)
    current_period INTEGER DEFAULT 1,
    
    -- Timer
    timer_seconds INTEGER DEFAULT 0,
    timer_running BOOLEAN DEFAULT FALSE,
    timer_direction TEXT DEFAULT 'up', -- 'up' for counting up, 'down' for countdown
    
    -- Match state
    status public.match_status DEFAULT 'upcoming',
    show_break_screen BOOLEAN DEFAULT FALSE,
    break_message TEXT,
    
    -- Access control
    access_code TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Enable realtime for matches
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;

-- Helper function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Helper function to check if user created the match
CREATE OR REPLACE FUNCTION public.is_match_creator(_match_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.matches
        WHERE id = _match_id AND created_by = auth.uid()
    )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.is_admin());

-- Matches policies
CREATE POLICY "Anyone can view matches"
ON public.matches FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create matches"
ON public.matches FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Match creators can update their matches"
ON public.matches FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "Match creators can delete their matches"
ON public.matches FOR DELETE
TO authenticated
USING (created_by = auth.uid() OR public.is_admin());

-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
    
    -- First user becomes admin
    IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
        INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
    ELSE
        INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON public.matches
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();