-- =============================================
-- CV Portfolio Database Setup
-- =============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-key';

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE
    ON public.contacts FOR EACH ROW EXECUTE PROCEDURE
    update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for contact form submissions)
CREATE POLICY "Allow public contact form submissions" ON public.contacts
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all contacts (for admin)
CREATE POLICY "Allow authenticated users to read contacts" ON public.contacts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update contacts (for admin)
CREATE POLICY "Allow authenticated users to update contacts" ON public.contacts
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete contacts (for admin)
CREATE POLICY "Allow authenticated users to delete contacts" ON public.contacts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- Insert some sample data (optional - remove in production)
INSERT INTO public.contacts (first_name, last_name, email, phone, message, status) VALUES
('John', 'Doe', 'john.doe@example.com', '+1-555-0123', 'Hello! I would like to discuss a potential project collaboration.', 'new'),
('Jane', 'Smith', 'jane.smith@example.com', '+1-555-0456', 'Great portfolio! I am interested in your React development services.', 'read'),
('Mike', 'Johnson', 'mike.johnson@example.com', NULL, 'Saw your work on GitHub. Very impressive!', 'replied');

-- =============================================
-- Authentication Setup (if using Supabase Auth)
-- =============================================

-- Create admin user profile table (optional)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- Useful Views and Functions
-- =============================================

-- View for contact analytics
CREATE OR REPLACE VIEW contact_analytics AS
SELECT 
    COUNT(*) as total_contacts,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
    COUNT(CASE WHEN status = 'read' THEN 1 END) as read_contacts,
    COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_contacts,
    DATE_TRUNC('day', created_at) as date
FROM public.contacts
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Function to get contact statistics
CREATE OR REPLACE FUNCTION get_contact_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(*),
        'new', COUNT(CASE WHEN status = 'new' THEN 1 END),
        'read', COUNT(CASE WHEN status = 'read' THEN 1 END),
        'replied', COUNT(CASE WHEN status = 'replied' THEN 1 END),
        'today', COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END),
        'this_week', COUNT(CASE WHEN created_at >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END),
        'this_month', COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)
    ) INTO result
    FROM public.contacts;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Security Notes
-- =============================================

/*
1. Make sure to set up proper authentication in Supabase
2. Update JWT secret in your Supabase settings
3. Consider adding rate limiting for contact form submissions
4. Add email validation and sanitization
5. Set up email notifications for new contacts
6. Consider adding CAPTCHA for the contact form
7. Backup your database regularly
8. Monitor for spam submissions

To use this setup:
1. Copy this SQL and run it in your Supabase SQL editor
2. Create an admin user account through Supabase Auth
3. Update the user_profiles table to set your account as 'admin'
4. Configure your environment variables in React app
*/ 