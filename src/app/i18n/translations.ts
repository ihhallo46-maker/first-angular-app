import de from './de.json';
import en from './en.json';
import zh from './zh.json';

export type Lang = 'de' | 'en' | 'zh';

export type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = { de, en, zh };
