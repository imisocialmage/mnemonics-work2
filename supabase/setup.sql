-- 1. Create the user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credits_remaining INTEGER DEFAULT 50 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can only read their own credits
DROP POLICY IF EXISTS "Users can read own credits" ON public.user_credits;
CREATE POLICY "Users can read own credits" 
ON public.user_credits 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Create a trigger function to initialize credits on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_credits (user_id, credits_remaining)
    VALUES (NEW.id, 100);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_credits();

-- 6. Create the ai_assets table
CREATE TABLE IF NOT EXISTS public.ai_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_index INTEGER DEFAULT 0,
    type TEXT,
    results JSONB,
    image_urls JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS for ai_assets
ALTER TABLE public.ai_assets ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies for ai_assets
DROP POLICY IF EXISTS "Users can manage own assets" ON public.ai_assets;
CREATE POLICY "Users can manage own assets" 
ON public.ai_assets 
FOR ALL 
USING (auth.uid() = user_id);
