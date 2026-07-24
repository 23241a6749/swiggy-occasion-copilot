#!/usr/bin/env bash
# ============================================================
# Deploy Occasion Copilot to Vercel
# Run this on your LOCAL machine (not in this sandbox)
# ============================================================

set -e

echo "🚀 Deploying Swiggy Occasion Copilot to Vercel..."

# Clone if not already cloned
if [ ! -d "swiggy-occasion-copilot" ]; then
  echo "📦 Cloning repo..."
  git clone https://github.com/23241a6749/swiggy-occasion-copilot.git
  cd swiggy-occasion-copilot
else
  cd swiggy-occasion-copilot
  git pull origin main
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel (creates a preview URL)
echo "🚀 Deploying to Vercel..."
npx vercel --prod --yes

echo ""
echo "✅ Deployed! Copy the URL from above."
echo ""
echo "📧 Your email reply:"
echo "  Subject: Re: Demo for Swiggy-Occasion-Copilot"
echo ""
echo "  Hi,"
echo ""
echo "  Here's the demo for Swiggy Occasion Copilot:"
echo "  • Live demo: <your-vercel-url>"
echo "  • GitHub: https://github.com/23241a6749/swiggy-occasion-copilot"
echo ""
echo "  The web UI shows a live AI agent session with real Swiggy MCP"
echo "  tool calls firing in sequence — Dineout reservation + Food"
echo "  delivery, coordinated in one conversation."
echo ""
echo "  Happy to hop on a call if that's more useful than a recording."
echo ""
echo "  Cheers,"
echo "  Sai Mohaneesh Neela"
