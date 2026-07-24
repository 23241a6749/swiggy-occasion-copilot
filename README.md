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

## Quick start (local)

```bash
# Clone
git clone https://github.com/23241a6749/swiggy-occasion-copilot.git
cd swiggy-occasion-copilot

# Install
npm install

# Run locally
npm run dev
# Open http://localhost:3000
```

Create `.env.local` (optional — demo works without it):

```
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
SWIGGY_MCP_FOOD_URL=https://mcp.swiggy.com/food
SWIGGY_MCP_DINEOUT_URL=https://mcp.swiggy.com/dineout
```

## Deploy to Vercel (one command)

```bash
chmod +x deploy.sh
./deploy.sh
```

Or manually:

```bash
npm install
npx vercel --prod
```

## Project structure

```
swiggy-occasion-copilot/
├── app/
│   ├── page.tsx              ← Interactive chat UI (the demo)
│   ├── layout.tsx            ← Root layout
│   ├── globals.css           ← Dark theme + animations
│   └── api/chat/route.ts    ← Claude + MCP agent (staging-ready)
├── components/
│   ├── ChatMessage.tsx      ← User/AI message bubbles
│   ├── ToolCallCard.tsx     ← Live MCP tool call display
│   ├── RestaurantCard.tsx   ← Dineout + Food result cards
│   ├── ConfirmBox.tsx       ← Staged 2-step confirmation
│   ├── WarnCard.tsx         ← Slot-unavailable edge case
│   └── TypingIndicator.tsx  ← 3-dot typing animation
├── lib/
│   ├── types.ts             ← TypeScript types
│   └── scenarios.ts         ← 3 demo scenarios
├── CLAUDE.md                ← Swiggy docs wiring for AI coding agents
├── deploy.sh                ← One-command Vercel deploy
└── README.md
```

## Demo — 3 interactive scenarios

The web UI has 3 built-in scenarios you can trigger with one click:

1. **Date night** — Italian in Indiranagar, 2 people, 8pm, gelato after
   → Shows full Dineout + Food parallel flow with confirmations

2. **Rooftop for 4** — biryani delivered home around 10pm
   → Shows coupon application + scheduled delivery reminder pattern

3. **Slot unavailable** — graceful fallback with 7-day alternative search
   → Shows the edge case recovery flow

## Loom recording script (3 minutes)

Use the **web UI** for the recording (no Claude Desktop needed):

**0:00–0:20 — HOOK**
> "I built an AI agent that plans your entire evening in one sentence — it books your restaurant table on Dineout and queues your food delivery, across two Swiggy MCP servers, with staged confirmations and real fallback logic."

**0:20–1:20 — WEB UI LIVE DEMO**
> Click "Date night — Italian in Indiranagar, 2 people, 8pm, gelato after"
> Narrate as the flow plays:
> - *"You see the agent calling get_saved_locations on Dineout and get_addresses on Food simultaneously — one OAuth token, two MCP servers."*
> - *"search_restaurants_dineout fires next — finding Italian options within 3km."*
> - *"get_available_slots confirms 3 slots at 8pm for 2 guests."*
> - *"The agent surfaces the restaurant card — Toscano Cucina, free reservation."*
> - *"Simultaneously, it searches for gelato on the Food server and builds the delivery cart."*
> - *"Then the staged confirmation box appears — Dineout and Food are independent transactions."*

**1:20–2:00 — EDGE CASE**
> Click "Show me what happens when a slot isn't available"
> *"The agent never dead-ends. Watch what happens when the requested slot is gone."*

**2:00–2:40 — CODE**
> Show 3 things:
> 1. `app/api/chat/route.ts` — the system prompt with Swiggy's rules
> 2. The `get_food_cart` before `place_food_order` pattern in the code
> 3. `CLAUDE.md` — show it's wired to real Swiggy docs

**2:40–3:00 — CLOSE**
> "Staging credentials are on the way. This is the prototype — the MCP-connected version is in active dev. Happy to show more."

## Status

- ✅ Interactive prototype UI live (3 scenarios, real tool call animations)
- ✅ Claude API route with full Swiggy MCP system prompt (staging-ready)
- ✅ CLAUDE.md wired to real Swiggy docs for AI coding agents
- 🔄 OAuth flow for web app (waiting on staging access)
- 🔄 Vercel deploy URL (run `deploy.sh` from your local machine)
