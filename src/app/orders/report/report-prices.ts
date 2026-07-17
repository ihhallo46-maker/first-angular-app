export type DrinkSize = '0.1L' | '0.2L' | '0.3L' | '0.5L' | '0.75L';

export interface DrinkPrice {
  name: string;
  prices: Partial<Record<DrinkSize, number>>;
}

// ── Preise hier anpassen ─────────────────────────────────────
export const DRINK_PRICES: DrinkPrice[] = [
  { name: 'Sprite',               prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Cola',                 prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Cola Zero',            prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Spezi',                prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Fanta',                prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Apfelschorle',         prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Bitter Lemon',         prices: { '0.3L': 2.90 } },
  { name: 'Ginger Ale',           prices: { '0.3L': 2.90 } },
  { name: 'Malzbier',             prices: { '0.3L': 2.90 } },
  { name: 'Wasser still',         prices: { '0.3L': 2.50, '0.75L': 5.00 } },
  { name: 'Wasser sprudel',       prices: { '0.3L': 2.50, '0.75L': 5.00 } },
  { name: 'Alkoholfreies Pils',   prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Pils',                 prices: { '0.3L': 3.20, '0.5L': 4.50 } },
  { name: 'Alkoholfreies Weizen', prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Weizen',               prices: { '0.3L': 3.20, '0.5L': 4.50 } },
  { name: 'Krefelder',            prices: { '0.3L': 3.20, '0.5L': 4.50 } },
  { name: 'Altbier',              prices: { '0.3L': 3.20, '0.5L': 4.50 } },
  { name: 'Radler',               prices: { '0.3L': 3.20, '0.5L': 4.50 } },
  { name: 'Alkoholfreier Radler', prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Alkoholfreier Alster', prices: { '0.3L': 2.90, '0.5L': 4.20 } },
  { name: 'Alster',               prices: { '0.3L': 3.20, '0.5L': 4.50 } },
  { name: 'Apfelsaft',            prices: { '0.3L': 2.90 } },
  { name: 'Orangensaft',          prices: { '0.3L': 2.90 } },
  { name: 'Maracuja',             prices: { '0.3L': 2.90 } },
  { name: 'Kaffee',               prices: { '0.3L': 2.50 } },
  { name: 'Espresso',             prices: { '0.3L': 2.00 } },
  { name: 'Doppelter Espresso',   prices: { '0.3L': 3.50 } },
  { name: 'China Tee',            prices: { '0.3L': 2.50 } },
  { name: 'Grüner Tee',           prices: { '0.3L': 2.50 } },
  { name: 'Rotwein',              prices: { '0.1L': 3.50, '0.2L': 6.00 } },
  { name: 'Weisswein',            prices: { '0.1L': 3.50, '0.2L': 6.00 } },
  { name: 'Rose',                 prices: { '0.1L': 3.50, '0.2L': 6.00 } },
  { name: 'Flasche Wein',         prices: { '0.75L': 18.00 } },
  { name: 'Reisschnaps',          prices: { '0.1L': 3.50 } },
  { name: 'Pflaumenwein',         prices: { '0.1L': 3.50 } },
];

export const BUFFET_ADULT_PRICE  = 18.90;
export const BUFFET_CHILD_PRICE  = 10.00;
