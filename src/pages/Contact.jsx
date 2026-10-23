import { useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import Socials from '../components/layout/Socials.jsx';
import { buildMailto } from '../lib/mailto.js';
import styles from './Contact.module.css';

// `onSend` exists for tests; by default the browser opens the mail client.
export default function Contact({ onSend = (href) => window.location.assign(href) }) {
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
      <PageHeader tag="U4" title="Contact Me" />

      <div className={styles.info}>
        <p>Please feel free to contact me!</p>
        <p className={styles.email}>jozef@waldhauser.sk</p>
        <Socials />
      </div>

      <section className={styles.formBox}>
        <h2>Send Me a Message</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="4" value={form.message} onChange={handleChange} required />

          <button type="submit">Submit</button>
        </form>
      </section>
    </>
  );
}
