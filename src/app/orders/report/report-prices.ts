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

// ── À-la-carte-Gerichte ──────────────────────────────────────
export interface CarteItemDef {
  id: number;
  name: string;
  price: number;
  category: string;
}

export const CARTE_ITEMS: CarteItemDef[] = [
  // Suppen
  { id:  1, name: 'Entensuppe',                         price: 3.50,  category: 'Suppen' },
  { id:  2, name: 'Peking-Gulasch-Suppe',               price: 3.50,  category: 'Suppen' },
  { id:  3, name: 'Wan-Tan-Suppe',                      price: 3.50,  category: 'Suppen' },
  { id:  4, name: 'Tomatensuppe',                       price: 3.30,  category: 'Suppen' },
  // Vorspeisen
  { id:  5, name: 'Frühlingsrolle',                     price: 3.50,  category: 'Vorspeisen' },
  { id:  6, name: 'Kroepoek',                           price: 3.50,  category: 'Vorspeisen' },
  // Gebratener Reis & Nudeln
  { id:  7, name: 'Bami-Goreng Spezial',                price: 13.50, category: 'Reis & Nudeln' },
  { id:  8, name: 'Nasi-Goreng Spezial',                price: 13.50, category: 'Reis & Nudeln' },
  // Schweinefleisch
  { id:  9, name: 'Chop-Suey (Schwein)',                price: 14.80, category: 'Schweinefleisch' },
  { id: 10, name: 'Schweinefleisch Sze-Chuan',          price: 14.80, category: 'Schweinefleisch' },
  { id: 11, name: 'Schweinefleisch m. Zwiebeln',        price: 14.80, category: 'Schweinefleisch' },
  { id: 12, name: 'Schweinefleisch Curry',              price: 14.80, category: 'Schweinefleisch' },
  { id: 13, name: 'Schweinefleisch gebacken süß-sauer', price: 14.80, category: 'Schweinefleisch' },
  { id: 14, name: 'Schweinefleisch Pat-Poi',            price: 14.80, category: 'Schweinefleisch' },
  { id: 15, name: 'Schweinefleisch Kung-Po',            price: 14.80, category: 'Schweinefleisch' },
  { id: 16, name: 'Schweinefleisch m. Morcheln',        price: 14.80, category: 'Schweinefleisch' },
  // Rindfleisch
  { id: 17, name: 'Chop-Suey (Rind)',                   price: 16.50, category: 'Rindfleisch' },
  { id: 18, name: 'Rindfleisch Sze-Chuan',              price: 16.50, category: 'Rindfleisch' },
  { id: 19, name: 'Rindfleisch m. Zwiebeln',            price: 16.50, category: 'Rindfleisch' },
  { id: 20, name: 'Rindfleisch Curry',                  price: 16.50, category: 'Rindfleisch' },
  { id: 21, name: 'Rindfleisch m. Morcheln',            price: 16.50, category: 'Rindfleisch' },
  { id: 22, name: 'Rindfleisch Pat-Poi',                price: 16.50, category: 'Rindfleisch' },
  { id: 23, name: 'Rindfleisch Kung-Po',                price: 16.50, category: 'Rindfleisch' },
  // Hühnerfleisch
  { id: 24, name: 'Chop-Suey (Huhn)',                   price: 14.80, category: 'Hühnerfleisch' },
  { id: 25, name: 'Hühnerfleisch Sze-Chuan',            price: 14.80, category: 'Hühnerfleisch' },
  { id: 26, name: 'Hühnerfleisch Kung-Po',              price: 14.80, category: 'Hühnerfleisch' },
  { id: 27, name: 'Hühnerfleisch m. Morcheln',          price: 14.80, category: 'Hühnerfleisch' },
  { id: 28, name: 'Pan. Huhn Sze-Chuan',                price: 14.80, category: 'Hühnerfleisch' },
  { id: 29, name: 'Pan. Huhn Erdnuss-Sauce',            price: 14.80, category: 'Hühnerfleisch' },
  { id: 30, name: 'Pan. Huhn Canton',                   price: 14.80, category: 'Hühnerfleisch' },
  { id: 31, name: 'Pan. Huhn Malaya',                   price: 14.80, category: 'Hühnerfleisch' },
  // Enten-Spezialitäten
  { id: 32, name: 'Ente Kung-Po',                       price: 17.90, category: 'Ente' },
  { id: 33, name: 'Ente Sze-Chuan',                     price: 17.90, category: 'Ente' },
  { id: 34, name: 'Ente Canton',                        price: 17.90, category: 'Ente' },
  { id: 35, name: 'Ente Malaya',                        price: 17.90, category: 'Ente' },
  { id: 36, name: 'Ente Hong-So',                       price: 17.90, category: 'Ente' },
  { id: 37, name: 'Ente Siu-Ja',                        price: 17.90, category: 'Ente' },
  // Scampis
  { id: 38, name: 'Scampis Sze-Chuan',                  price: 19.50, category: 'Scampis' },
  { id: 39, name: 'Scampis Curry',                      price: 19.50, category: 'Scampis' },
  { id: 40, name: 'Scampis gebacken',                   price: 19.50, category: 'Scampis' },
  { id: 41, name: 'Scampis Knoblauch',                  price: 19.50, category: 'Scampis' },
  { id: 42, name: 'Scampis + Ente Sze-Chuan',           price: 19.50, category: 'Scampis' },
  { id: 43, name: 'Scampis + Ente Kung-Po',             price: 19.50, category: 'Scampis' },
  // Fisch
  { id: 44, name: 'Fischfilet süß-sauer',               price: 13.80, category: 'Fisch' },
  { id: 45, name: 'Fischfilet Sze-Chuan',               price: 13.80, category: 'Fisch' },
  // Leber
  { id: 46, name: 'Hühnerleber + Huhn Sze-Chuan',       price: 13.80, category: 'Leber' },
  { id: 47, name: 'Hühnerleber m. Zwiebeln',            price: 13.80, category: 'Leber' },
  { id: 48, name: 'Hühnerleber m. Gemüse',              price: 13.80, category: 'Leber' },
  // Vegetarisch
  { id: 49, name: 'Gemüseplatte',                       price: 12.00, category: 'Vegetarisch' },
  { id: 50, name: 'Gebratene Nudeln (veg.)',             price:  9.00, category: 'Vegetarisch' },
  // Spezialitäten
  { id: 51, name: 'Kung-Po Spezial',                    price: 17.90, category: 'Spezialitäten' },
  { id: 52, name: 'Sze-Chuan Spezial',                  price: 17.90, category: 'Spezialitäten' },
  { id: 53, name: 'Acht Schätze',                       price: 15.90, category: 'Spezialitäten' },
  { id: 54, name: 'Chow-Sam-Sing Spezial',              price: 15.90, category: 'Spezialitäten' },
  { id: 55, name: 'Sze-Chuan-Schätze',                  price: 15.90, category: 'Spezialitäten' },
  { id: 56, name: 'Pat-Poi-Schätze',                    price: 15.90, category: 'Spezialitäten' },
  // Kinder
  { id: 57, name: 'Schwein + Huhn (Kinder)',            price: 10.50, category: 'Kinder' },
  { id: 58, name: 'Gebratene Nudeln (Kinder)',           price:  8.50, category: 'Kinder' },
  // Nachtisch
  { id: 59, name: 'Gebackene Bananen',                   price:  3.50, category: 'Nachtisch' },
];
