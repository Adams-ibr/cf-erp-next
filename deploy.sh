#!/bin/bash
# Deploy to Vercel via CLI

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    npm i -g vercel@latest
fi

# Login (will open browser if not logged in)
vercel login

# Deploy to production
vercel --prod --yes

# Or deploy preview
# vercel --yes