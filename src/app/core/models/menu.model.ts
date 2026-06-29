// Datenmodelle der Speisekarte.
// Bewusst unabhängig von Firebase – damit später ein Python-Backend
// dieselben Modelle nutzen kann, ohne dass sich etwas ändern muss.

import { type MenuItem } from '../../menu/menu-data';

export { type MenuItem };

export interface MenuCategory {
  id?: string;
  title: string;
  order: number;
  items: MenuItem[];
}
