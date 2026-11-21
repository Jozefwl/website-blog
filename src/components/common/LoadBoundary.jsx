import { Component } from 'react';

// Catches a lazy page that fails to load (e.g. a tab left open across a deploy, whose old
// chunk no longer exists) so the visitor gets a reload button instead of a blank site.
export default class LoadBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" style={{ textAlign: 'center', padding: '48px 16px' }}>
        <p>Couldn&apos;t load this page. The site was probably updated while you had it open.</p>
        <button type="button" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }
}
