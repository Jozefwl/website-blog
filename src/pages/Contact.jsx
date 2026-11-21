import { useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import Socials from '../components/layout/Socials.jsx';
import { buildMailto } from '../lib/mailto.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import styles from './Contact.module.css';

// `onSend` exists for tests; by default the browser opens the mail client.
export default function Contact({ onSend = (href) => window.location.assign(href) }) {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', message: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSend(buildMailto(form.name, form.message));
  }

  return (
    <>
      <PageHeader tag="U4" title={t('contact.title')} />

      <div className={styles.info}>
        <p>{t('contact.intro')}</p>
        <p className={styles.email}>jozef@waldhauser.sk</p>
        <Socials />
      </div>

      <section className={styles.formBox}>
        <h2>{t('contact.formTitle')}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="name">{t('contact.name')}</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />

          <label htmlFor="message">{t('contact.message')}</label>
          <textarea id="message" name="message" rows="4" value={form.message} onChange={handleChange} required />

          <button type="submit">{t('contact.submit')}</button>
        </form>
      </section>
    </>
  );
}
