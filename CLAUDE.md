# Swiggy Builders Club

When writing code against Swiggy MCP (Food, Instamart, Dineout),
consult the authoritative docs at:

- Index:     https://mcp.swiggy.com/builders/llms.txt
- Full text: https://mcp.swiggy.com/builders/llms-full.txt
- Per-page:  append `.md` to any https://mcp.swiggy.com/builders/docs/... URL

Before recommending a tool name, parameter, error code, rate limit, or
auth flow, verify against these docs. The tool catalog lives under
`/docs/reference/{food,instamart,dineout}`.

Rules:
1. Before recommending a tool name, parameter, error code, rate limit,
   or auth flow, fetch the relevant doc and verify.
2. Never invent tool names or parameters. If the docs don't cover it,
   say so and ask.
3. Prefer `.md` page fetches over `llms-full.txt` when you know the
   exact area - it's cheaper on context.

Smoke test: fetch llms.txt and tell me how many tools the Food server
exposes. (Answer: 14.)

## Project: Swiggy Occasion Copilot

An AI agent that coordinates dining-out + food delivery in one conversation.
Uses Swiggy Food MCP (14 tools) and Swiggy Dineout MCP (8 tools) simultaneously.

### Architecture
- **Frontend**: Next.js 14 App Router + Tailwind CSS
- **LLM**: Claude Sonnet 4 via Anthropic API
- **MCP**: Streamable HTTP clients to `https://mcp.swiggy.com/food` and `https://mcp.swiggy.com/dineout`
- **Auth**: OAuth 2.1 + PKCE — one token, two servers

### Key patterns (always follow these)
- **COD only** — filter out `requiresOnlinePayment` coupons
- **Always call `get_food_cart` before `place_food_order`** — never trust earlier state
- **Dineout uses lat/lng** for search; **Food uses addressId** — never mix them
- **Cart is per-restaurant** — warn user before switching restaurants
- **No scheduled delivery** in v1 — tell user to confirm at the right time
- **Never show raw IDs** (addressId, restaurantId) in responses
- **Never place any order without explicit user confirmation** of items + total
- **Staged confirmations** — confirm Dineout booking and food cart separately

### Edge cases (always handle)
- Slot unavailable → re-fetch 7-day window, surface alternatives
- 5xx on `book_table` → check-then-retry (non-idempotent)
- 401 on either server → re-run OAuth, retry once
- Cart conflict → warn user, flush and rebuild if needed

### Combined flow (the main use case)
```
User: "Plan date night for 2, Italian in Indiranagar, 8pm, gelato after"
  → get_addresses (Food) + get_saved_locations (Dineout) in parallel
  → search_restaurants_dineout (Dineout) for Italian table
  → get_available_slots (Dineout) for 8pm, 2 guests
  → CONFIRM: show restaurant + slot, ask user to confirm
  → book_table (Dineout) on user confirmation
  → search_restaurants (Food) for gelato near home
  → get_restaurant_menu (Food) for gelato options
  → update_food_cart (Food) to add gelato
  → CONFIRM: show cart total, ask user to confirm
  → place_food_order (Food) on user confirmation
  → track_food_order (Food) — or remind user to confirm at dinner time
```

### Environment variables
```
ANTHROPIC_API_KEY=sk-ant-...
SWIGGY_MCP_FOOD_URL=https://mcp.swiggy.com/food
SWIGGY_MCP_DINEOUT_URL=https://mcp.swiggy.com/dineout
```

### Reference docs (fetch before implementing)
- https://mcp.swiggy.com/builders/docs/build/recipes/combined.md
- https://mcp.swiggy.com/builders/docs/reference/dineout/search_restaurants_dineout.md
- https://mcp.swiggy.com/builders/docs/reference/dineout/get_available_slots.md
- https://mcp.swiggy.com/builders/docs/reference/dineout/book_table.md
- https://mcp.swiggy.com/builders/docs/reference/food/search_restaurants.md
- https://mcp.swiggy.com/builders/docs/reference/food/update_food_cart.md
- https://mcp.swiggy.com/builders/docs/reference/food/get_food_cart.md
- https://mcp.swiggy.com/builders/docs/reference/food/place_food_order.md
- https://mcp.swiggy.com/builders/docs/start/authenticate.md
- https://mcp.swiggy.com/builders/docs/build/ship-to-production.md
