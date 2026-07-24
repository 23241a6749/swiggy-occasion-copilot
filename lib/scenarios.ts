import { ChatItem } from './types';

// Deterministic ID generator
function id(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Date helpers
function today(): string {
  return new Date().toISOString().split('T')[0];
}

export type ScenarioKey = 'date' | 'rooftop' | 'slot';

export function buildScenario(key: ScenarioKey): ChatItem[] {
  const items: ChatItem[] = [];

  if (key === 'date') {
    // Opening AI response
    items.push({
      kind: 'message',
      data: {
        id: id(),
        role: 'assistant',
        content:
          'Got it — date night for 2, Italian in Indiranagar around 8pm, with gelato delivered home after. Let me fire up both MCP servers simultaneously and find the best options for you.',
      },
    });

    // Parallel: resolve addresses on both servers
    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_saved_locations',
        server: 'dineout',
        args: {},
        result: `→ home address resolved (lat: 12.9784, lng: 77.6408)`,
        status: 'success',
      },
    });
    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_addresses',
        server: 'food',
        args: {},
        result: `→ addr_home confirmed (Indiranagar, Bengaluru)`,
        status: 'success',
      },
    });

    // Dineout search
    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'search_restaurants_dineout',
        server: 'dineout',
        args: {
          query: 'Italian',
          entityType: 'CUISINE',
          lat: 12.9784,
          lng: 77.6408,
        },
        result: '→ 4 results within 3km',
        status: 'success',
      },
    });

    // Get available slots
    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_available_slots',
        server: 'dineout',
        args: {
          restaurantId: 'rest_toscano',
          date: today(),
          guestCount: 2,
        },
        result: '→ 3 slots available, 8:00pm confirmed',
        status: 'success',
      },
    });

    // Dineout restaurant card
    items.push({
      kind: 'restaurant-card',
      data: {
        id: id(),
        name: 'Toscano Cucina',
        server: 'dineout',
        meta: '⭐ 4.6 · 2.1 km · Italian · Rooftop available',
        price: 'Free reservation · Tonight 8:00pm, 2 guests',
        type: 'dineout',
      },
    });

    // Food search for gelato
    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'search_restaurants',
        server: 'food',
        args: {
          query: 'gelato',
          addressId: 'addr_home',
        },
        result: '→ 2 results, both open till 11pm',
        status: 'success',
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_restaurant_menu',
        server: 'food',
        args: {
          restaurantId: 'rest_amore',
          addressId: 'addr_home',
        },
        result: '→ 8 gelato flavours, Pista & Belgian Chocolate highlighted',
        status: 'success',
      },
    });

    // Food restaurant card
    items.push({
      kind: 'restaurant-card',
      data: {
        id: id(),
        name: 'Amore Gelato & Sorbets',
        server: 'food',
        meta: '⭐ 4.4 · 28 min delivery · Open till 11pm · COD',
        price: '~₹360 for 2 tubs (Pista + Belgian Chocolate)',
        type: 'food',
      },
    });

    // Confirm box
    items.push({
      kind: 'confirm-box',
      data: {
        id: id(),
        dineoutText: 'Toscano Cucina — Tonight 8:00pm, 2 guests · Free',
        foodText: 'Amore Gelato cart ready — place when you\'re heading back · ~₹360 COD',
      },
    });
  }

  if (key === 'rooftop') {
    items.push({
      kind: 'message',
      data: {
        id: id(),
        role: 'assistant',
        content:
          'Rooftop for 4 tonight, biryani delivered home around 10pm — searching Dineout for rooftop options and getting your address from the Food server.',
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_addresses',
        server: 'food',
        args: {},
        result: '→ addr_home confirmed',
        status: 'success',
      },
    });
    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_saved_locations',
        server: 'dineout',
        args: {},
        result: '→ saved locations resolved',
        status: 'success',
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'search_restaurants_dineout',
        server: 'dineout',
        args: {
          query: 'rooftop',
          entityType: 'RESTAURANT_CATEGORY',
          lat: 12.9784,
          lng: 77.6408,
        },
        result: '→ 3 rooftop restaurants found',
        status: 'success',
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_available_slots',
        server: 'dineout',
        args: {
          restaurantId: 'rest_sky',
          date: today(),
          guestCount: 4,
        },
        result: `→ 8:30pm slot available, 4 guests`,
        status: 'success',
      },
    });

    items.push({
      kind: 'restaurant-card',
      data: {
        id: id(),
        name: 'Sky Social',
        server: 'dineout',
        meta: '⭐ 4.5 · Rooftop · DJ nights Fri–Sat · 2.8km',
        price: 'Free reservation · Tonight 8:30pm, 4 guests',
        type: 'dineout',
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'search_restaurants',
        server: 'food',
        args: {
          query: 'biryani',
          addressId: 'addr_home',
        },
        result: '→ 5 restaurants, 2 open past 10pm',
        status: 'success',
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'fetch_food_coupons',
        server: 'food',
        args: {
          restaurantId: 'rest_biryani_house',
        },
        result: '→ WELCOME49 valid · COD compatible ✓',
        status: 'success',
      },
    });

    items.push({
      kind: 'restaurant-card',
      data: {
        id: id(),
        name: 'Biryani House',
        server: 'food',
        meta: '⭐ 4.3 · 25 min delivery · Open till 11pm · Coupon applied',
        price: '₹349 after WELCOME49 · COD',
        type: 'food',
      },
    });

    items.push({
      kind: 'confirm-box',
      data: {
        id: id(),
        dineoutText: 'Sky Social — Tonight 8:30pm, 4 guests · Free',
        foodText: 'Biryani House cart ready — place when you\'re leaving restaurant · ₹349 COD',
      },
    });
  }

  if (key === 'slot') {
    items.push({
      kind: 'message',
      data: {
        id: id(),
        role: 'assistant',
        content:
          "Here's what the agent does when the requested slot isn't available — it never dead-ends, always surfaces alternatives.",
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_available_slots',
        server: 'dineout',
        args: {
          restaurantId: 'rest_terraza',
          date: today(),
          guestCount: 4,
        },
        result: '⚠ requested slot UNAVAILABLE — slot filled up',
        status: 'error',
      },
    });

    items.push({
      kind: 'warn-card',
      data: {
        id: id(),
        title: 'Slot no longer available',
        body: 'The 7:30pm slot for Terraza Rooftop was just taken. Fetching the next 7 days of availability now...',
        options: ['Try 8:00pm tonight', 'Try tomorrow 7:30pm', 'Search different restaurant'],
      },
    });

    items.push({
      kind: 'tool-call',
      data: {
        id: id(),
        name: 'get_available_slots',
        server: 'dineout',
        args: {
          restaurantId: 'rest_terraza',
          date: today(),
          guestCount: 4,
          refetch: true,
        },
        result: '→ 3 alternative slots found across 5 days',
        status: 'success',
      },
    });

    items.push({
      kind: 'message',
      data: {
        id: id(),
        role: 'assistant',
        content: 'Found 3 alternatives — closest to your original preference:',
      },
    });

    items.push({
      kind: 'restaurant-card',
      data: {
        id: id(),
        name: 'Terraza Rooftop — 8:00pm tonight',
        server: 'dineout',
        meta: '⭐ 4.5 · Same restaurant · 30 min later than requested',
        price: 'Free reservation · Tonight 8:00pm, 4 guests',
        type: 'dineout',
      },
    });

    items.push({
      kind: 'message',
      data: {
        id: id(),
        role: 'assistant',
        content:
          "I'll hold off on placing anything until you confirm one option. The food cart for later is already prepared and waiting.",
      },
    });
  }

  return items;
}

export function detectScenario(text: string): ScenarioKey {
  const t = text.toLowerCase();
  if (t.includes('slot') || t.includes('unavailable') || t.includes('happens when') || t.includes('edge')) return 'slot';
  if (t.includes('rooftop') || t.includes('biryani') || t.includes('4 people') || t.includes('4guest')) return 'rooftop';
  return 'date';
}
