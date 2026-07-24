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

## Key Patterns

- **COD only** — `requiresOnlinePayment` coupons are filtered out
- **Always call `get_food_cart` before `place_food_order`** — never trust earlier state
- **Dineout uses lat/lng** for search; **Food uses addressId** — never mix them
- **Cart is per-restaurant on Food** — warn user before switching
- **No scheduled delivery in v1** — prepare cart, remind user to confirm at right time
- **Never show raw IDs** in responses
- **Never place any order without explicit user confirmation**

## Quick Start

```bash
git clone https://github.com/23241a6749/swiggy-occasion-copilot.git
cd swiggy-occasion-copilot
npm install
npm run dev
```

Create `.env.local` (optional — demo works without it for the prototype):

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
SWIGGY_MCP_FOOD_URL=https://mcp.swiggy.com/food
SWIGGY_MCP_DINEOUT_URL=https://mcp.swiggy.com/dineout
```

## Deploy to Vercel

```bash
npm install
npx vercel --prod
```

## Project Structure

```
├── app/
│   ├── page.tsx              ← Interactive chat UI (demo)
│   ├── layout.tsx            ← Root layout
│   ├── globals.css           ← Dark theme + animations
│   └── api/chat/route.ts    ← Claude + MCP agent
├── components/
│   ├── ChatMessage.tsx       ← User/AI message bubbles
│   ├── ToolCallCard.tsx      ← Live MCP tool call display
│   ├── RestaurantCard.tsx    ← Dineout + Food result cards
│   ├── ConfirmBox.tsx        ← Staged 2-step confirmation
│   ├── WarnCard.tsx          ← Slot-unavailable edge case
│   └── TypingIndicator.tsx    ← 3-dot typing animation
├── lib/
│   ├── types.ts              ← TypeScript types
│   └── scenarios.ts          ← 3 demo scenarios
├── CLAUDE.md                 ← Swiggy docs wiring for AI coding agents
├── deploy.sh                 ← One-command Vercel deploy
└── README.md
```

## Agent Flow

```
User: "Plan date night for 2, Italian, 8pm, gelato after"

Step 1 → get_saved_locations (Dineout) + get_addresses (Food) — parallel
Step 2 → search_restaurants_dineout (Dineout) + search_restaurants (Food) — parallel
Step 3 → get_available_slots (Dineout) + get_restaurant_menu (Food)
Step 4 → Show results + staged confirmation (Dineout & Food separately)
Step 5 → book_table (Dineout) on confirmation → place_food_order (Food)
```

Each server confirmation is independent. Partial success is surfaced explicitly — a failed food order never silently cancels a Dineout booking.

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Slot unavailable | Re-fetches 7-day window, surfaces 3 alternatives |
| 5xx on book_table | Check-then-retry via get_booking_status |
| 401 mid-session | Re-run OAuth 2.1 PKCE, retry once |
| Cart conflict | Warn user before switching restaurants |
| COD-only | Filter requiresOnlinePayment coupons at agent layer |
| Scheduled delivery | Prepare cart, remind user to confirm at right time |

## Status

- ✅ Interactive prototype UI live
- ✅ Claude API route with full Swiggy MCP system prompt
- 🔄 OAuth flow for web app (pending staging access)
