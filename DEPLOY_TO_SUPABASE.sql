-- BSM Platform - Complete Database Schema
-- Run this SQL in your Supabase SQL Editor to make your app fully dynamic

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Customer', 'Admin')),
    avatar_url TEXT,
    phone VARCHAR(20),
    department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Enterprise', 'SMB', 'Startup', 'Individual')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Pending')),
    industry VARCHAR(255),
    size VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Hardware', 'Software', 'Service', 'License', 'Document')),
    category VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Maintenance', 'Retired')),
    value DECIMAL(10,2),
    location VARCHAR(255),
    assigned_to UUID REFERENCES users(id),
    account_id UUID REFERENCES accounts(id),
    purchase_date TIMESTAMP WITH TIME ZONE,
    warranty_expiry TIMESTAMP WITH TIME ZONE,
    description TEXT,
    serial_number VARCHAR(255),
    vendor VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    category VARCHAR(255),
    subcategory VARCHAR(255),
    assigned_to UUID REFERENCES users(id)

, created_by UUID REFERENCES users(id),
    account_id UUID REFERENCES accounts(id),
    asset_id UUID REFERENCES assets(id),
    due_date TIMESTAMP WITH TIME ZONE,
    resolution TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Active', 'Inactive', 'Archived')),
    category VARCHAR(255),
    trigger_type VARCHAR(255),
    conditions JSONB,
    actions JSONB,
    execution_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.0,
    last_executed TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255),
    tags TEXT[],
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Published', 'Archived')),
    views INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    not_helpful_votes INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Info', 'Warning', 'Error', 'Success')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Requests table
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    service_type VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected', 'In Progress', 'Completed')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    requested_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    account_id UUID REFERENCES accounts(id),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Error', 'Pending')),
    configuration JSONB,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rules table
CREATE TABLE IF NOT EXISTS rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Active', 'Inactive')),
    priority INTEGER DEFAULT 0,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    execution_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.0,
    last_executed TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (id, name, email, role, phone, department) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@bsm.com', 'Admin', '+1-555-0101', 'IT Administration'),
  ('22222222-2222-2222-2222-222222222222', 'John Doe', 'john.doe中techcorp.com', 'Customer', '+1-555-0102', 'Engineering'),
  ('33333333-3333-3333-3333-333333333333', 'Jane Smith', 'jane.smith@startupxyz.com', 'Customer', '+1-555-0103', 'Product Management')
ON CONFLICT (email) DO NOTHING;

INSERT INTO accounts (id, name, account_type, status, industry, size, email, website, description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TechCorp Solutions', 'Enterprise', 'Active', 'Technology', '500+', 'contact@techcorp.com', 'https://techcorp.com', 'Leading technology solutions provider'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'StartupXYZ', 'Startup', 'Active', 'FinTech', '10-50', 'info@startupxyz.com', 'https://startupxyz.com', 'Innovative financial technology startup'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'SMBSolutions', 'SMB', 'Active', 'Manufacturing', '50-200', 'hello@smbsolutions.com', 'https://smbsolutions.com', 'SMB manufacturing solutions')
ON CONFLICT (id) DO NOTHING;

INSERT INTO knowledge_base (title, content, category, status, views, helpful_votes, featured, author_id) VALUES
  ('Welcome to Our Platform', 'Learn how to get started with our platform and make the most of its features. This comprehensive guide covers all the basics you need to know.', 'Getting Started', 'Published', 1250, 90, TRUE, '11111111-1111-1111-1111-111111111111'),
  ('Account Setup Guide', 'Complete guide to setting up your account and configuring settings. Step-by-step instructions for optimal setup.', 'Account Management', 'Published', 890, 91, TRUE, '11111111-1111-1111-1111-111111111111'),
  ('Billing and Payment Methods', 'Everything you need to know about billing, payments, and subscription management.', 'Billing & Payments', 'Published', 650, 80, FALSE, '11111111-1111-1111-1111-111111111111'),
  ('API Authentication Guide', 'Learn how to authenticate with our API and manage your API keys effectively.', 'API Documentation', 'Published', 420, 88, FALSE, '11111111-1111-1111-1111-111111111111'),
  ('Troubleshooting Common Issues', 'Quick fixes for the most common issues you might encounter with our platform.', 'Technical Support', 'Published', 1100, 89, FALSE, '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

INSERT INTO tickets (title, description, status, priority, category, assigned_to, created_by, account_id, due_date, tags) VALUES
  ('Server Performance Issue', 'Application responding slowly during peak hours', 'Open', 'High', 'IT Support', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-02-25T17:00:00Z', ARRAY['performance', 'server', 'urgent']),
  ('Office 365 License Renewal', 'Need to renew Office 365 licenses before expiration', 'In Progress', 'Medium', 'Software Management', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-02-28T12:00:00Z', ARRAY['license', 'renewal', 'office365']),
  ('Network Connectivity Problem', 'Users unable to access internet in building A', 'Resolved', 'Critical', 'Network Issues', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-02-20T16:00:00Z', ARRAY['network', 'connectivity', 'resolved'])
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;

-- Create basic policies for public access (since we're using Anon key)
CREATE POLICY "Enable select for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable select for all accounts" ON accounts FOR SELECT USING (true);
CREATE POLICY "Enable select for all assets" ON assets FOR SELECT USING (true);
CREATE POLICY "Enable select for all tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Enable select for all workflows" ON workflows FOR SELECT USING (true);
CREATE POLICY "Enable select for all knowledge_base" ON knowledge_base FOR SELECT USING (true);
CREATE POLICY "Enable select for all service_requests" ON service_requests FOR SELECT USING (true);
CREATE POLICY "Enable select for all integrations" ON integrations FOR SELECT USING (true);
CREATE POLICY "Enable select for all rules" ON rules FOR SELECT USING (true);
CREATE POLICY "Enable select for own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enable insert for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all accounts" ON accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all assets" ON assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all workflows" ON workflows FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all knowledge_base" ON knowledge_base FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all service_requests" ON service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all integrations" ON integrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all rules" ON rules FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable update for all accounts" ON accounts FOR UPDATE USING (true);
CREATE POLICY "Enable update for all assets" ON assets FOR UPDATE USING (true);
CREATE POLICY "Enable update for all tickets" ON tickets FOR UPDATE USING (true);
CREATE POLICY "Enable update for all workflows" ON workflows FOR UPDATE USING (true);
CREATE POLICY "Enable update for all knowledge_base" ON knowledge_base FOR UPDATE USING (true);
CREATE POLICY "Enable update for all service_requests" ON service_requests FOR UPDATE USING (true);
CREATE POLICY "Enable update for all integrations" ON integrations FOR UPDATE USING (true);
CREATE POLICY "Enable update for all rules" ON rules FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON users FOR DELETE USING (true);
CREATE POLICY "Enable delete for all accounts" ON accounts FOR DELETE USING (true);
CREATE POLICY "Enable delete for all assets" ON assets FOR DELETE USING (true);
CREATE POLICY "Enable delete for all tickets" ON tickets FOR DELETE USING (true);
CREATE POLICY "Enable delete for all workflows" ON workflows FOR DELETE USING (true);
CREATE POLICY "Enable delete for all knowledge_base" ON knowledge_base FOR DELETE USING (true);
CREATE POLICY "Enable delete for all service_requests" ON service_requests FOR DELETE USING (true);
CREATE POLICY "Enable delete for all integrations" ON integrations FOR DELETE USING (true);
CREATE POLICY "Enable delete for all rules" ON rules FOR DELETE USING (true);
