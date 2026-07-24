# Swiggy Occasion Copilot

An AI agent that coordinates dining-out and food delivery in one conversation using Swiggy MCP servers.

**Example:** *"Plan date night for 2, Italian, budget ₹2000, dessert at home after."*

The agent:
- Searches Dineout restaurants and checks live table availability
- Books reservations with staged confirmations
- Prepares food delivery carts in parallel
- Handles partial failures safely (Dineout booking and Food delivery are independent)
- Manages edge cases: slot unavailable, 5xx errors, auth expiry, cart conflicts

## Tech Stack

- **Frontend**: Next.js 14 App Router + Tailwind CSS
- **LLM**: Claude Sonnet 4 via Anthropic API
- **MCP**: Streamable HTTP clients to `https://mcp.swiggy.com/food` and `https://mcp.swiggy.com/dineout`
- **Auth**: OAuth 2.1 + PKCE — one token, two servers

## Key patterns

- **COD only** — `requiresOnlinePayment` coupons are filtered out
- **Always call `get_food_cart` before `place_food_order`** — never trust earlier state
- **Dineout uses lat/lng** for search; **Food uses addressId** — never mix them
- **Cart is per-restaurant on Food** — warn user before switching
- **No scheduled delivery in v1** — prepare cart, remind user to confirm at right time
- **Never show raw IDs** (addressId, restaurantId) in responses
- **Never place any order without explicit user confirmation**

## Quick start

```bash
npm install
npm run dev
```

Create `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
SWIGGY_MCP_FOOD_URL=https://mcp.swiggy.com/food
SWIGGY_MCP_DINEOUT_URL=https://mcp.swiggy.com/dineout
```

## Deploy to Vercel

```bash
npx vercel --prod
```

## Claude Desktop MCP Setup (for live API calls)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swiggy-food": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.swiggy.com/food"]
    },
    "swiggy-dineout": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.swiggy.com/dineout"]
    }
  }
}
```

Restart Claude Desktop, authenticate with your Swiggy account, then try:

- *"Search Italian restaurants near Indiranagar, Bengaluru"*
- *"Show available Dineout slots for tonight, 2 people"*
- *"Search gelato near my home address"*

## Status

- ✅ Prototype UI live (interactive demo with 3 scenarios)
- ✅ Claude Desktop MCP integration documented
- 🔄 Next.js + Claude API route (wiring MCP servers on staging access approval)
- 🔄 OAuth flow for web app
