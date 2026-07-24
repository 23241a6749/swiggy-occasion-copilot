export type MessageRole = 'user' | 'assistant' | 'system';

export type ServerType = 'food' | 'dineout' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  server?: ServerType;
}

export interface ToolCall {
  id: string;
  name: string;
  server: ServerType;
  args: Record<string, unknown>;
  result?: string;
  status: 'pending' | 'success' | 'error';
}

export interface RestaurantCard {
  id: string;
  name: string;
  server: ServerType;
  meta: string;
  price: string;
  type: 'dineout' | 'food';
}

export interface ConfirmBox {
  id: string;
  dineoutText: string;
  foodText: string;
}

export interface WarnCard {
  id: string;
  title: string;
  body: string;
  options: string[];
}

export type ChatItem =
  | { kind: 'message'; data: Message }
  | { kind: 'tool-call'; data: ToolCall }
  | { kind: 'restaurant-card'; data: RestaurantCard }
  | { kind: 'confirm-box'; data: ConfirmBox }
  | { kind: 'warn-card'; data: WarnCard }
  | { kind: 'typing'; data: null };
