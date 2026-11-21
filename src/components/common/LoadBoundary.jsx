import { Component } from 'react';
import { useLang } from '../../i18n/LanguageContext.jsx';

function LoadFailed() {
  const { t } = useLang();
  return (
    <div role="alert" style={{ textAlign: 'center', padding: '48px 16px' }}>
      <p>{t('load.failed')}</p>
      <button type="button" onClick={() => window.location.reload()}>
        {t('load.reload')}
      </button>
    </div>
  );
}

// Catches a lazy page that fails to load (e.g. a tab left open across a deploy, whose old
// chunk no longer exists) so the visitor gets a reload button instead of a blank site.
export default class LoadBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <LoadFailed />;
  }
}
