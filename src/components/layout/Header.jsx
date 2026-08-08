import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-neutral)' }}>
        <Search size={20} style={{ marginRight: '0.5rem' }} />
        <input 
          type="text" 
          placeholder="Global search..." 
          style={{ 
            border: 'none', 
            outline: 'none', 
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem'
          }} 
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--color-text-neutral)' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', 
            backgroundColor: 'var(--color-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={16} />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin Portal</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
