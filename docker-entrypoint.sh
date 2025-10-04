#!/bin/sh
CONFIG_FILE="/app/dist/config.js"

echo "Injecting runtime environment variables..."
sed -i "s|__VITE_API_BASE_URL__|${{VITE_API_BASE_URL}}|g" "$CONFIG_FILE"

echo "Configuration injected successfully!"
echo "API_BASE_URL: ${VITE_API_BASE_URL}"
exec "$@"
