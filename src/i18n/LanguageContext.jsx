import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.js';
import sk from './sk.js';

// English / Slovak. Interface text lives in en.js / sk.js (same keys); content text in the
// data files is written as { en, sk } and picked with pick(). No provider = English.
export const LANGUAGES = ['en', 'sk'];
const DICTIONARIES = { en, sk };
const STORAGE_KEY = 'lang';

const lookup = (dict, key) => key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);

// t('rack.open', { title: 'About' }) -> 'Open About'. Missing keys fall back to English, then the key.
export function translate(lang, key, vars) {
  const text = lookup(DICTIONARIES[lang], key) ?? lookup(en, key) ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match)) : text;
}

// { en, sk } -> the current language; anything else is returned as is (URLs, numbers...).
export const pick = (value, lang) => (value && typeof value === 'object' && 'en' in value ? (value[lang] ?? value.en) : value);

export function detectLanguage(storage, languages = []) {
  try {
    const saved = storage?.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    // Blocked storage: fall through to the browser's languages.
  }
  return languages.some((l) => String(l).toLowerCase().startsWith('sk')) ? 'sk' : 'en';
}

function safeLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const browserLanguages = () => (typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language]));

const makeValue = (lang, setLang) => ({ lang, setLang, t: (key, vars) => translate(lang, key, vars) });
const LanguageContext = createContext(makeValue('en', () => {}));

export function LanguageProvider({ children, storage = safeLocalStorage(), languages = browserLanguages() }) {
  const [lang, setLangState] = useState(() => detectLanguage(storage, languages));

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const setLang = (next) => {
      if (!LANGUAGES.includes(next)) return;
      try {
        storage?.setItem(STORAGE_KEY, next);
      } catch {
        // Not saved; the switch still works for this visit.
      }
      setLangState(next);
    };
    return makeValue(lang, setLang);
  }, [lang, storage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
