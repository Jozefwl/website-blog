"use client";
import { useState, useEffect } from 'react';

const CookieNotice = () => {
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowCookieNotice(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieNotice(false);
  };

  // Don't render anything on server side or if cookies already accepted
  if (!isClient || !showCookieNotice) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px 20px',
      zIndex: 1000,
      borderTop: '2px solid rgb(0, 0, 71)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '15px' 
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
            <strong>Disclaimer:</strong> This site uses cookies for basic functionality.
            Meteoblue's cookies are used by the weather widget (by clicking Expand Weather), cloudflare collects metrics for website statistics (these can be blocked with adblock), some metrics I collect: the IP address and userAgent into ephemeral log storage (cached, not saved, deleted from RAM when metrics server is restarted) in such a way that it cannot be linked to any individuals (security purposes). 
            <br></br>For implementation details see my github in the <a href="/contact">Contact page</a> or <a href="/links">Links page</a>.
          </p>
        </div>
        <button
          onClick={acceptCookies}
          style={{
            backgroundColor: 'rgb(0, 0, 71)',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(0, 0, 100)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(0, 0, 71)'}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CookieNotice;