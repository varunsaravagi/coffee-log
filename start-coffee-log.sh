#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm.sh not found in $NVM_DIR" >&2
  exit 1
fi

. "$NVM_DIR/nvm.sh"

cd "$SCRIPT_DIR"
nvm use 24 >/dev/null
npm run start
