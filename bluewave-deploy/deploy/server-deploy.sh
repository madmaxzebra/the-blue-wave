#!/bin/bash
# Run this on your server after uploading Blue Wave
set -e
cd "$(dirname "$0")/.."
echo "Building and starting Blue Wave..."
docker compose up -d --build
echo "Done. App running on port 4001."
echo "Add nginx config for bluewave.zebra-onlinedesign.com (see deploy/DEPLOY-SERVER.md)"
