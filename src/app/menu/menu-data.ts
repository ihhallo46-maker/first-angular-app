export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuData = {
  sections: [
    {
      title: 'Suppen',
      items: [
        { name: 'Entensuppe', price: '€ 3,50' },
        { name: 'Peking-Gulasch-Suppe', price: '€ 3,50' },
        { name: 'Wan-Tan-Suppe', price: '€ 3,50' },
        { name: 'Tomatensuppe', price: '€ 3,30', description: 'mit Hühnerfleisch' },
      ],
    },
    {
      title: 'Vorspeisen',
      items: [
        { name: 'Frühlingsrolle', price: '€ 3,50', description: 'Loempia' },
        { name: 'Kroepoek', price: '€ 3,50', description: 'Krabben-Crackers' },
      ],
    },
    {
      title: 'Gebratener Reis & Nudeln',
      items: [
        { name: 'Bami-Goreng Spezial', price: '€ 13,50', description: 'gebratene Nudeln mit verschiedenem Fleisch (leicht scharf)' },
        { name: 'Nasi-Goreng Spezial', price: '€ 13,50', description: 'gebratener Reis mit verschiedenem Fleisch (leicht scharf)' },
      ],
    },
    {
      title: 'Schweinefleisch',
      items: [
        { name: 'Chop-Suey (chin. Gemüse)', price: '€ 14,80', description: 'mit Schweinefleisch' },
        { name: 'Schweinefleisch Sze-Chuan', price: '€ 14,80', description: 'Gemüse in scharfer Sauce' },
        { name: 'Schweinefleisch', price: '€ 14,80', description: 'mit gebratenen Zwiebeln' },
        { name: 'Schweinefleisch', price: '€ 14,80', description: 'mit Champignons, Bambus, Paprika in Curry-Sauce' },
        { name: 'Gebackenes Schweinefleisch', price: '€ 14,80', description: 'mit Ananas in süß-saurer Sauce' },
        { name: 'Schweinefleisch Pat-Poi', price: '€ 14,80', description: 'mit Gemüse in pikant-scharfer Sauce' },
        { name: 'Schweinefleisch Kung-Po', price: '€ 14,80', description: 'mit Gemüse in Knoblauchsauce; scharf' },
        { name: 'Schweinefleisch', price: '€ 14,80', description: 'mit Morcheln, Bambussprossen und Champignons' },
      ],
    },
    {
      title: 'Rindfleisch',
      items: [
        { name: 'Chop-Suey (chin. Gemüse)', price: '€ 16,50', description: 'mit Rindfleisch' },
        { name: 'Rindfleisch Sze-Chuan', price: '€ 16,50', description: 'mit Gemüse in scharfer Sauce' },
        { name: 'Rindfleisch', price: '€ 16,50', description: 'mit gebratenen Zwiebeln' },
        { name: 'Rindfleisch', price: '€ 16,50', description: 'mit Champignons, Bambus, Paprika in Curry-Sauce (scharf)' },
        { name: 'Rindfleisch', price: '€ 16,50', description: 'mit Champignons, Morcheln und Bambussprossen' },
        { name: 'Rindfleisch Pat Poi', price: '€ 16,50', description: 'mit Gemüse in pikant-scharfer Sauce' },
        { name: 'Rindfleisch Kung-Po', price: '€ 16,50', description: 'mit Gemüse in Knoblauchsauce; scharf' },
      ],
    },
    {
      title: 'Hühnerfleisch',
      items: [
        { name: 'Chop-Suey (chin. Gemüse)', price: '€ 14,80', description: 'mit Hühnerfleisch' },
        { name: 'Hühnerfleisch Sze-Chuan', price: '€ 14,80', description: 'mit Gemüse in scharfer Sauce' },
        { name: 'Hühnerfleisch Kung-Po', price: '€ 14,80', description: 'mit Gemüse in Knoblauchsauce; scharf' },
        { name: 'Hühnerfleisch', price: '€ 14,80', description: 'mit Morcheln, Bambussprossen und Champignons' },
        { name: 'Paniertes Hühnerfleisch', price: '€ 14,80', description: 'à la Sze-Chuan, in leicht scharfer Sauce' },
        { name: 'Paniertes Hühnerfleisch', price: '€ 14,80', description: 'mit Knoblauch- oder Erdnuss-Sauce' },
        { name: 'Paniertes Hühnerfleisch', price: '€ 14,80', description: 'à la Canton, mit Ananas in süß-saurer Sauce' },
        { name: 'Paniertes Hühnerfleisch', price: '€ 14,80', description: 'à la Malaya, in Curry-Sauce' },
      ],
    },
    {
      title: 'Enten-Spezialitäten des Hauses',
      items: [
        { name: 'Gebratene Ente à la Kung-Po', price: '€ 17,90', description: 'mit Gemüse, Knoblauch-Sauce; scharf' },
        { name: 'Gebratene Ente à la Sze-Chuan', price: '€ 17,90', description: 'mit in süß-saurer, scharfer Sauce' },
        { name: 'Gebratene Ente à la Canton', price: '€ 17,90', description: 'mit Ananas in süß-saurer Sauce' },
        { name: 'Gebratene Ente à la Malaya', price: '€ 17,90', description: 'in scharfer Curry-Sauce' },
        { name: 'Gebratene Ente à la Hong-So', price: '€ 17,90', description: 'Ente paniert in süß-saurer oder pikant-scharfer Sauce' },
        { name: 'Gebratene Ente à la Siu-Ja', price: '€ 17,90', description: 'mit Pflaumen-Sauce süß und scharf oder Champignon-Soja-Sauce' },
      ],
    },
    {
      title: 'Scampisgerichte',
      items: [
        { name: 'Chinesische Scampis Sze-Chuan', price: '€ 19,50', description: 'mit Gemüse in süß-saurer-scharfer Sauce' },
        { name: 'Chinesische Scampis', price: '€ 19,50', description: 'mit Gemüse in Curry-Sauce' },
        { name: 'Chinesische Scampis', price: '€ 19,50', description: 'gebacken in süß-saurer Sauce' },
        { name: 'Chinesische Scampis', price: '€ 19,50', description: 'mit Gemüse in leicht scharfer Knoblauch-Sauce' },
        { name: 'Sze-Chuan Ha Scampis und gebr. Entenbrust', price: '€ 19,50', description: 'mit Gemüse in süß-saurer, leicht scharfer Sauce' },
        { name: 'Ku-Pot Ha Scampis und gebr. Entenbrust', price: '€ 19,50', description: 'mit Gemüse in leicht scharfer Knoblauch-Sauce' },
      ],
    },
    {
      title: 'Fischgerichte',
      items: [
        { name: 'Fischfilet gebacken', price: '€ 13,80', description: 'mit süß-saurer Sauce' },
        { name: 'Fischfilet gebacken à la Sze-Chuan', price: '€ 13,80', description: 'leicht scharf' },
      ],
    },
    {
      title: 'Leberspeisen',
      items: [
        { name: 'Hühnerleber und Hühnerfleisch', price: '€ 13,80', description: 'à la Sze-Chuan, mit Gemüse in süß-saurer-scharfer Sauce' },
        { name: 'Hühnerleber', price: '€ 13,80', description: 'mit gebratenen Zwiebeln' },
        { name: 'Hühnerleber', price: '€ 13,80', description: 'mit speziellem Gemüse in Soja-Sauce' },
      ],
    },
    {
      title: 'Vegetarisches',
      items: [
        { name: 'Gemüseplatte', price: '€ 12,00', description: 'mit Reis' },
        { name: 'Gebratene Nudeln', price: '€ 9,00', description: 'mit Sojabohnen' },
      ],
    },
    {
      title: 'Spezialitäten des Hauses',
      items: [
        { name: 'Kung-Po Spezial', price: '€ 17,90', description: 'Rind-, Schweinefleisch und gebratene Ente mit Gemüse in Knoblauch-Sauce; scharf' },
        { name: 'Sze-Chuan Spezial', price: '€ 17,90', description: 'Rind-, Schweine- und Hühnerfleisch, gebratene Ente, mit Gemüse in scharfer Sauce' },
        { name: 'Acht Schätze', price: '€ 15,90', description: '(chinesische Zutaten in scharfer Sauce) Rind-, Schweine-, Enten- und Hühnerfleisch, mit Gemüse' },
        { name: 'Spezial Chow-Sam-Sing', price: '€ 15,90', description: 'Rind-, Schweine-, Enten- und Hühnerfleisch, mit verschiedenem chinesischem Gemüse' },
        { name: 'Sze-Chuan-Schätze', price: '€ 15,90', description: 'gebratenes Hühner-, Rind-, Schweine- und Entenfleisch, mit Gemüse in einer süß-sauren, leicht scharfen Sauce' },
        { name: 'Pat-Poi-Schätze', price: '€ 15,90', description: 'gebratenes Hühner-, Rind-, Schweine- und Entenfleisch, mit Gemüse in chinesischer, pikant-scharfer Sauce' },
      ],
    },
    {
      title: 'Für unsere kleinen Gäste',
      items: [
        { name: 'Schweinefleisch & gebrat. Hühnerfleisch', price: '€ 10,50', description: 'mit Champignon-Sauce und Pommes frites' },
        { name: 'Gebratene Nudeln', price: '€ 8,50', description: 'mit Hühnerfleisch' },
      ],
    },
    {
      title: 'Nachtisch',
      items: [
        { name: 'Gebackene Bananen', price: '€ 3,50', description: 'gebacken, mit Honig' },
      ],
    },
  ],
};