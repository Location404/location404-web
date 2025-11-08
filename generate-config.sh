#!/bin/sh

DIST_DIR="${DIST_DIR:-/app/dist}"

CONFIG_SCRIPT="<script>window.APP_CONFIG={VITE_AUTH_API:'${VITE_AUTH_API:-}',VITE_GAME_API:'${VITE_GAME_API:-}',VITE_DATA_API:'${VITE_DATA_API:-}',VITE_GOOGLE_MAPS_API_KEY:'${VITE_GOOGLE_MAPS_API_KEY:-}'}</script>"

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "ERROR: $DIST_DIR/index.html not found"
  exit 1
fi

sed -i "s|<head>|<head>${CONFIG_SCRIPT}|" "$DIST_DIR/index.html"

echo "Runtime config injected into $DIST_DIR/index.html"
grep -q "APP_CONFIG" "$DIST_DIR/index.html" && echo "SUCCESS: Config injected" || echo "WARNING: Config not found in HTML"
