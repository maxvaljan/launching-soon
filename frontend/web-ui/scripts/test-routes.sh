#!/bin/bash

# This script tests key routes in development mode
echo "Testing key routes in development mode..."

# List of important routes to check
ROUTES=(
  "/"
  "/about"
  "/services"
  "/business"
  "/drivers"
  "/investment"
  "/contact"
  "/signin"
  "/signup"
  "/dashboard"
)

# Base URL for the development server
BASE_URL="http://localhost:3000"

# Check if the development server is running
if ! curl -s "$BASE_URL" > /dev/null; then
  echo "Development server not running! Please start with 'npm run dev' first."
  exit 1
fi

# Test each route
for route in "${ROUTES[@]}"; do
  echo "Testing route: $route"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
  
  if [ "$STATUS" -eq 200 ]; then
    echo "✅ Route $route is working (Status: $STATUS)"
  else
    echo "❌ Route $route returned status $STATUS"
  fi
done

echo "Route testing complete"