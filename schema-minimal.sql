-- Minimal schema to test UUID issues
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer', 'agent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Pending', 'Resolved', 'Closed')),
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    category VARCHAR(100),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can create tickets" ON tickets
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can read own tickets" ON tickets
    FOR SELECT USING (auth.uid() = created_by);

-- Insert test data
INSERT INTO users (id, email, name, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'customer@bsm.com', 'John Customer', 'customer'),
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'agent@bsm.com', 'Support Agent', 'agent');

INSERT INTO tickets (id, subject, description, status, priority, category, created_by) VALUES
    ('880e8400-e29b-41d4-a716-446655440000'::uuid, 'Test Ticket', 'This is a test ticket', 'Open', 'High', 'Test', '550e8400-e29b-41d4-a716-446655440001'::uuid);

