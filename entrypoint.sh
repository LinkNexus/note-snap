#!/bin/sh

echo "🚀 Starting NOTE_SNAP application..."

# Configure pnpm store
pnpm config set store-dir /app/.pnpm-store

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
fi

# Wait for database to be ready
echo "🔄 Waiting for database to be ready..."
until pg_isready -h database -p 5432 -U app >/dev/null 2>&1; do
  echo "   Database is unavailable - waiting..."
  sleep 2
done
echo "✅ Database is ready!"

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📤 Pushing database schema..."
npx prisma db push --skip-generate

echo "🎉 Setup complete! Starting application..."
exec "$@"
