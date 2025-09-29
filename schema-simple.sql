-- Simple schema without RLS to avoid UUID comparison issues
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer', 'agent')),
    company VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('enterprise', 'small_business', 'individual')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    industry VARCHAR(100),
    size VARCHAR(50),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Pending', 'Resolved', 'Closed')),
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    account_id UUID REFERENCES accounts(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    author_id UUID REFERENCES users(id),
    views INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('incident', 'request', 'change', 'problem')),
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    requester_id UUID REFERENCES users(id),
    assignee_id UUID REFERENCES users(id),
    account_id UUID REFERENCES accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (email, name, role, company, department) VALUES
    ('admin@bsm.com', 'Admin User', 'admin', 'BSM Corp', 'IT'),
    ('customer@bsm.com', 'John Customer', 'customer', 'Customer Corp', 'Operations'),
    ('agent@bsm.com', 'Support Agent', 'agent', 'BSM Corp', 'Support');

INSERT INTO accounts (name, type, status, industry, size, contact_email) VALUES
    ('Customer Corp', 'enterprise', 'active', 'Technology', '1000+', 'contact@customer.com'),
    ('Small Business Inc', 'small_business', 'active', 'Retail', '50-100', 'info@smallbiz.com');

-- Insert sample tickets
INSERT INTO tickets (subject, description, status, priority, category, created_by) 
SELECT 
    'Login Issue', 
    'Cannot access the portal', 
    'Open', 
    'High', 
    'Authentication', 
    id 
FROM users WHERE email = 'customer@bsm.com';

INSERT INTO tickets (subject, description, status, priority, category, created_by) 
SELECT 
    'Feature Request', 
    'Need new dashboard widget', 
    'In Progress', 
    'Medium', 
    'Enhancement', 
    id 
FROM users WHERE email = 'customer@bsm.com';

INSERT INTO tickets (subject, description, status, priority, category, created_by) 
SELECT 
    'Bug Report', 
    'Chart not displaying correctly', 
    'Resolved', 
    'High', 
    'Bug', 
    id 
FROM users WHERE email = 'customer@bsm.com';

-- Insert sample knowledge base articles
INSERT INTO knowledge_base (title, content, category, tags, author_id, views, helpful_votes) 
SELECT 
    'How to Reset Password', 
    'Step-by-step guide to reset your password...', 
    'Authentication', 
    ARRAY['password', 'login', 'security'], 
    id, 
    45, 
    12 
FROM users WHERE email = 'admin@bsm.com';

INSERT INTO knowledge_base (title, content, category, tags, author_id, views, helpful_votes) 
SELECT 
    'Creating Support Tickets', 
    'Learn how to create effective support tickets...', 
    'General', 
    ARRAY['tickets', 'support', 'help'], 
    id, 
    78, 
    23 
FROM users WHERE email = 'admin@bsm.com';

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, read, priority) 
SELECT 
    id, 
    'New Ticket Assigned', 
    'You have been assigned a new high-priority ticket', 
    'info', 
    false, 
    'high' 
FROM users WHERE email = 'customer@bsm.com';

INSERT INTO notifications (user_id, title, message, type, read, priority) 
SELECT 
    id, 
    'System Maintenance', 
    'Scheduled maintenance will occur tonight at 2 AM', 
    'warning', 
    true, 
    'medium' 
FROM users WHERE email = 'customer@bsm.com';

