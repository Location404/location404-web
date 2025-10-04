#!/bin/sh
set -e

# Script de entrypoint para injetar variáveis de ambiente em runtime
# Este script substitui os placeholders no config.js com valores reais

CONFIG_FILE="/app/dist/config.js"

echo "Injecting runtime environment variables..."

# Verifica se a variável está definida
if [ -z "$VITE_API_BASE_URL" ]; then
    echo "WARNING: VITE_API_BASE_URL is not set. Using placeholder."
    VITE_API_BASE_URL="http://localhost:3000"
fi

# Substitui os placeholders pelas variáveis de ambiente
sed -i "s|__VITE_API_BASE_URL__|$VITE_API_BASE_URL|g" "$CONFIG_FILE"

echo "Configuration injected successfully!"
echo "API_BASE_URL: $VITE_API_BASE_URL"

# Mostra o conteúdo do config.js para debug
echo "Config file content:"
cat "$CONFIG_FILE"

# Inicia o servidor
exec "$@"
