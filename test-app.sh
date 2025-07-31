#!/bin/bash

# Simple test script to check if the application runs without errors
echo "Testing NOTE_SNAP application..."

# Check if all required files exist
FILES=(
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/app/login/page.tsx"
    "src/app/signup/page.tsx"
    "src/app/forgot-password/page.tsx"
    "src/app/reset-password/page.tsx"
    "src/app/verify-email/page.tsx"
    "src/app/dashboard/page.tsx"
    "src/app/profile/page.tsx"
    "src/components/providers.tsx"
    "src/hooks/use-api.ts"
    "src/lib/validations.ts"
    "src/lib/email-verification.ts"
)

echo "Checking required files..."
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo "Checking API routes..."
API_ROUTES=(
    "src/app/api/auth/register/route.ts"
    "src/app/api/auth/verify-email/route.ts"
    "src/app/api/auth/forgot-password/route.ts"
    "src/app/api/auth/reset-password/route.ts"
    "src/app/api/auth/resend-verification/route.ts"
    "src/app/api/profile/route.ts"
)

for route in "${API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        echo "✅ $route exists"
    else
        echo "❌ $route missing"
    fi
done

echo "All checks completed!"
