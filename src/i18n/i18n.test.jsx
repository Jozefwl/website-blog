import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import en from './en.js';
import sk from './sk.js';
import { LanguageProvider, detectLanguage, pick, translate, useLang } from './LanguageContext.jsx';
import * as about from '../data/about.js';
import * as projects from '../data/projects.js';
import * as services from '../data/services.js';
import * as slides from '../data/slides.js';
import * as rackUnits from '../data/rackUnits.js';

// "a.b.c" paths of every leaf string in a nested dictionary.
const leafKeys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => (typeof v === 'object' ? leafKeys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));

// Every { en, sk } pair anywhere inside a value.
function bilingualPairs(value, path = '', out = []) {
  if (Array.isArray(value)) value.forEach((v, i) => bilingualPairs(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') {
    if ('en' in value || 'sk' in value) out.push([path, value]);
    else Object.entries(value).forEach(([k, v]) => bilingualPairs(v, `${path}.${k}`, out));
  }
  return out;
}

describe('dictionaries', () => {
  test('English and Slovak have exactly the same keys', () => {
    expect(leafKeys(sk).sort()).toEqual(leafKeys(en).sort());
  });

  test('no Slovak string is left empty', () => {
    for (const key of leafKeys(sk)) {
      const value = key.split('.').reduce((o, k) => o[k], sk);
      expect(value.trim(), key).not.toBe('');
    }
  });

  test('{placeholders} match between languages', () => {
    for (const key of leafKeys(en)) {
      const get = (dict) => key.split('.').reduce((o, k) => o[k], dict);
      const vars = (s) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(vars(get(sk)), key).toEqual(vars(get(en)));
    }
  });
});

describe('content data', () => {
  test.each([
    ['about', about],
    ['projects', projects],
    ['services', services],
    ['slides', slides],
    ['rackUnits', rackUnits],
  ])('%s: every bilingual text has both languages', (_name, mod) => {
    const pairs = bilingualPairs(mod);
    for (const [path, value] of pairs) {
      expect(Object.keys(value).sort(), path).toEqual(['en', 'sk']);
      for (const lang of ['en', 'sk']) {
        const v = value[lang];
        expect(typeof v === 'string' ? v.trim() : v, `${path}.${lang}`).toBeTruthy();
      }
    }
  });

  test('the About story is translated, not copied', () => {
    expect(about.ABOUT_SECTIONS.map((s) => s.title.sk)).toEqual(['Ako to začalo', 'Kam to viedlo', 'Vo voľnom čase']);
  });
});

describe('translate / pick', () => {
  test('looks up nested keys and fills {placeholders}', () => {
    expect(translate('en', 'rack.open', { title: 'About' })).toBe('Open About');
    expect(translate('sk', 'nav.about')).toBe('O mne');
  });

  test('a missing key falls back to English, then to the key itself', () => {
    expect(translate('sk', 'no.such.key')).toBe('no.such.key');
  });

  test('pick returns the right language, or plain values unchanged', () => {
    expect(pick({ en: 'Hi', sk: 'Ahoj' }, 'sk')).toBe('Ahoj');
    expect(pick('https://example.com', 'sk')).toBe('https://example.com');
  });
});

describe('detectLanguage', () => {
  const storage = (value) => ({ getItem: () => value, setItem() {} });

  test('a saved choice wins', () => {
    expect(detectLanguage(storage('sk'), ['en-US'])).toBe('sk');
    expect(detectLanguage(storage('en'), ['sk-SK'])).toBe('en');
  });

  test('first visit: Slovak browsers get Slovak, everyone else English', () => {
    expect(detectLanguage(storage(null), ['sk-SK', 'en'])).toBe('sk');
    expect(detectLanguage(storage(null), ['de-DE', 'en'])).toBe('en');
    expect(detectLanguage(storage('fr'), ['en'])).toBe('en'); // junk in storage is ignored
  });

  test('blocked storage still works', () => {
    const blocked = {
      getItem() {
        throw new Error('blocked');
      },
    };
    expect(detectLanguage(blocked, ['sk'])).toBe('sk');
  });
});

describe('LanguageProvider', () => {
  function Probe() {
    const { lang, setLang, t } = useLang();
    return (
      <>
        <p data-testid="text">{t('nav.about')}</p>
        <button type="button" onClick={() => setLang(lang === 'en' ? 'sk' : 'en')}>
          toggle
        </button>
      </>
    );
  }

  test('without a provider everything is English', () => {
    render(<Probe />);
    expect(screen.getByTestId('text')).toHaveTextContent('About');
  });

  test('switching updates text, <html lang> and the saved choice', () => {
    const saved = new Map();
    const storage = { getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, v) };
    render(
      <LanguageProvider storage={storage} languages={['en']}>
        <Probe />
      </LanguageProvider>,
    );
    expect(document.documentElement.lang).toBe('en');
    act(() => fireEvent.click(screen.getByRole('button', { name: 'toggle' })));
    expect(screen.getByTestId('text')).toHaveTextContent('O mne');
    expect(document.documentElement.lang).toBe('sk');
    expect(saved.get('lang')).toBe('sk');
  });
});

describe('Footer language switch', () => {
  test('EN | SK in the footer switches the whole page', async () => {
    const { MemoryRouter } = await import('react-router');
    const { default: Footer } = await import('../components/layout/Footer.jsx');
    const { default: Navbar } = await import('../components/layout/Navbar.jsx');
    const saved = new Map();
    const storage = { getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, v) };
    render(
      <LanguageProvider storage={storage} languages={['en-US']}>
        <MemoryRouter>
          <Navbar />
          <Footer />
        </MemoryRouter>
      </LanguageProvider>,
    );
    const group = screen.getByRole('group', { name: 'Language' });
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();

    act(() => fireEvent.click(screen.getByRole('button', { name: 'SK' })));
    expect(screen.getByRole('button', { name: 'SK' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: 'O mne' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Jazyk' })).toBe(group);
    expect(saved.get('lang')).toBe('sk');
    expect(screen.getByRole('contentinfo')).toHaveTextContent(`© ${new Date().getFullYear()} Jozef Waldhauser`);
  });
});
