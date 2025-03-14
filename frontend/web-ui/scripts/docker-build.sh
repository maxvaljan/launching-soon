#!/bin/bash
set -e

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display section headers
section() {
  echo -e "\n${BLUE}==>${NC} ${YELLOW}$1${NC}"
}

# Function to display success messages
success() {
  echo -e "${GREEN}✓${NC} $1"
}

# Function to display error messages and exit
error() {
  echo -e "${RED}✗${NC} $1"
  exit 1
}

# Navigate to the web-ui directory
cd "$(dirname "$0")/.."
WEB_UI_DIR=$(pwd)

section "Setting up environment"
# Create a default .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating default .env.local file"
  cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://placeholder-for-build.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key-for-build
EOL
fi
success "Environment variables set up"

section "Cleaning previous build artifacts"
rm -rf .next || true
success "Cleaned previous builds"

section "Installing dependencies"
npm install || error "Failed to install dependencies"
success "Dependencies installed"

section "Building Next.js application"
NODE_OPTIONS="--max-old-space-size=4096" npm run build || error "Failed to build Next.js application"
success "Next.js build completed successfully"

section "Building Docker image"
# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
IMAGE_NAME="maxmove-web-ui"
TAG="${VERSION}"

echo "Building Docker image: ${IMAGE_NAME}:${TAG}"
docker build -t ${IMAGE_NAME}:${TAG} . || error "Docker build failed"
docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:latest
success "Docker image built successfully: ${IMAGE_NAME}:${TAG}"

section "Verifying Docker image"
docker images ${IMAGE_NAME}
success "Image verification complete"

echo -e "\n${GREEN}==>${NC} ${YELLOW}Build Complete!${NC}"
echo -e "To run the Docker container:"
echo -e "  ${BLUE}docker run -p 3000:3000 ${IMAGE_NAME}:latest${NC}"
echo ""