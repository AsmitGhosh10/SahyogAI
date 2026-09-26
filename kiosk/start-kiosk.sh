#!/usr/bin/env bash
# Raspberry Pi kiosk launcher (Raspberry Pi OS with desktop, Chromium installed).
# Usage: SAHYOG_URL=https://your-sahyog-server.example ./start-kiosk.sh
# The URL must be HTTPS (or localhost): browsers only allow microphone access on secure origins.
set -euo pipefail
URL="${SAHYOG_URL:?Set SAHYOG_URL to your SahyogAI server, e.g. https://sahyog.example.org}/kiosk"

# Keep the screen awake.
xset s off || true
xset -dpms || true
xset s noblank || true

exec chromium-browser \
  --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble \
  --autoplay-policy=no-user-gesture-required \
  --use-fake-ui-for-media-stream \
  --check-for-update-interval=31536000 \
  "$URL"
