#!/bin/bash

# Production startup script for BSM Platform on Render
echo "🚀 Starting BSM Platform..."

# Set environment variables
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the applications
echo "🔨 Building applications..."
npm run build

# Start the applications
echo "🌟 Starting applications..."
npm run start
