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
            🍪 <strong>This site uses cookies</strong> for basic functionality. 
            This is a personal website - I hold no liability for any content or services provided. 
            Use at your own discretion.
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
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieNotice;