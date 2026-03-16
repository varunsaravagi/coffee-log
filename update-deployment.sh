#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
SERVICE_NAME="${SERVICE_NAME:-coffee-log}"
BRANCH_NAME="${BRANCH_NAME:-main}"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm.sh not found in $NVM_DIR" >&2
  exit 1
fi

. "$NVM_DIR/nvm.sh"

cd "$SCRIPT_DIR"
nvm use 24 >/dev/null

echo "Updating source from origin/$BRANCH_NAME..."
git fetch origin "$BRANCH_NAME"
git pull --ff-only origin "$BRANCH_NAME"

echo "Installing dependencies..."
npm install

echo "Building production app..."
npm run build

echo "Restarting systemd service: $SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"

echo "Deployment updated successfully."
echo "Check service status with: sudo systemctl status $SERVICE_NAME"

