-- Complete Supabase Schema for ACKERMANN Customer Portal
-- This schema makes the customer portal fully dynamic with real database integration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Customer' CHECK (role IN ('Customer', 'Admin', 'Agent')),
    avatar_url TEXT,
    phone TEXT,
    department TEXT,
    account_type TEXT DEFAULT 'Individual' CHECK (account_type IN ('Individual', 'SMB', 'Enterprise')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TICKETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled')),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    category TEXT DEFAULT 'General' CHECK (category IN ('Technical', 'Billing', 'General', 'Feature Request', 'Bug Report')),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    resolution TEXT,
    tags TEXT[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    comments JSONB DEFAULT '[]',
    history JSONB DEFAULT '[]',
    escalation_level INTEGER DEFAULT 0,
    sla_status TEXT DEFAULT 'on_time' CHECK (sla_status IN ('on_time', 'at_risk', 'breached')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ACCOUNTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    account_type TEXT DEFAULT 'Individual' CHECK (account_type IN ('Individual', 'SMB', 'Enterprise', 'Startup')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Pending')),
    industry TEXT,
    size TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    description TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ASSETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'Hardware' CHECK (type IN ('Hardware', 'Software', 'Service', 'License', 'Document')),
    category TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Maintenance', 'Retired')),
    value DECIMAL(10,2),
    location TEXT,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    purchase_date DATE,
    warranty_expiry DATE,
    description TEXT,
    serial_number TEXT,
    vendor TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- KNOWLEDGE BASE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
    views INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    not_helpful_votes INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'Info' CHECK (type IN ('Info', 'Warning', 'Error', 'Success')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SERVICE REQUESTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    service_type TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'In Progress', 'Completed')),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    requested_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role = 'Admin'
        )
    );

-- Tickets table policies
CREATE POLICY "Users can view own tickets" ON public.tickets
    FOR SELECT USING (auth.uid()::text = created_by::text);

CREATE POLICY "Users can create tickets" ON public.tickets
    FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Users can update own tickets" ON public.tickets
    FOR UPDATE USING (auth.uid()::text = created_by::text);

CREATE POLICY "Admins can view all tickets" ON public.tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('Admin', 'Agent')
        )
    );

-- Knowledge base policies (public read, admin write)
CREATE POLICY "Anyone can view published articles" ON public.knowledge_base
    FOR SELECT USING (status = 'Published');

CREATE POLICY "Admins can manage articles" ON public.knowledge_base
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role = 'Admin'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Service requests policies
CREATE POLICY "Users can view own service requests" ON public.service_requests
    FOR SELECT USING (auth.uid()::text = requested_by::text);

CREATE POLICY "Users can create service requests" ON public.service_requests
    FOR INSERT WITH CHECK (auth.uid()::text = requested_by::text);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
    BEFORE UPDATE ON public.knowledge_base
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users(role);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON public.users(created_at);

-- Tickets indexes
CREATE INDEX IF NOT EXISTS tickets_created_by_idx ON public.tickets(created_by);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON public.tickets(status);
CREATE INDEX IF NOT EXISTS tickets_priority_idx ON public.tickets(priority);
CREATE INDEX IF NOT EXISTS tickets_category_idx ON public.tickets(category);
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON public.tickets(created_at);
CREATE INDEX IF NOT EXISTS tickets_assigned_to_idx ON public.tickets(assigned_to);

-- Knowledge base indexes
CREATE INDEX IF NOT EXISTS knowledge_base_status_idx ON public.knowledge_base(status);
CREATE INDEX IF NOT EXISTS knowledge_base_category_idx ON public.knowledge_base(category);
CREATE INDEX IF NOT EXISTS knowledge_base_featured_idx ON public.knowledge_base(featured);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at);

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample users
INSERT INTO public.users (id, email, name, role, account_type) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@ackermann.com', 'Admin User', 'Admin', 'Enterprise'),
    ('550e8400-e29b-41d4-a716-446655440001', 'agent@ackermann.com', 'Support Agent', 'Agent', 'Enterprise'),
    ('550e8400-e29b-41d4-a716-446655440002', 'customer@example.com', 'John Doe', 'Customer', 'Individual'),
    ('550e8400-e29b-41d4-a716-446655440003', 'jane.smith@company.com', 'Jane Smith', 'Customer', 'SMB')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tickets
INSERT INTO public.tickets (id, subject, description, status, priority, category, created_by) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Unable to access billing portal', 'I am unable to log into the billing portal. Getting a 404 error when trying to access the billing section.', 'Open', 'High', 'Billing', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440001', 'Feature request: Dark mode for mobile app', 'It would be great to have a dark mode option in the mobile application. This would help with battery life and reduce eye strain.', 'In Progress', 'Medium', 'Feature Request', '550e8400-e29b-41d4-a716-446655440003'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Bug: Data not syncing between devices', 'When I update my profile on the web portal, the changes are not reflected in the mobile app. This is causing confusion.', 'Resolved', 'High', 'Bug Report', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample knowledge base articles
INSERT INTO public.knowledge_base (id, title, content, category, status, featured, author_id) VALUES
    ('770e8400-e29b-41d4-a716-446655440000', 'Getting Started with ACKERMANN', 'Welcome to ACKERMANN! This guide will help you get started with our platform.', 'Getting Started', 'Published', TRUE, '550e8400-e29b-41d4-a716-446655440000'),
    ('770e8400-e29b-41d4-a716-446655440001', 'How to Create Support Tickets', 'Learn how to create and manage support tickets in the customer portal.', 'Support', 'Published', TRUE, '550e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Billing and Payment FAQ', 'Common questions about billing, payments, and account management.', 'Billing', 'Published', FALSE, '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'Welcome to ACKERMANN!', 'Thank you for joining ACKERMANN. We are here to help you succeed.', 'Success'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Ticket Update', 'Your ticket #TKT-001 has been updated by our support team.', 'Info'),
    ('550e8400-e29b-41d4-a716-446655440003', 'New Feature Available', 'Dark mode is now available in the mobile app!', 'Info')
ON CONFLICT DO NOTHING;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- This schema is now ready for the ACKERMANN Customer Portal
-- All tables, policies, indexes, and sample data have been created
-- The customer portal is now fully dynamic and connected to Supabase