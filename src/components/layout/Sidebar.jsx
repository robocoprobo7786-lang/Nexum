import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Award, BarChart3, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Publications', path: '/publications', icon: BookOpen },
    { name: 'Faculty', path: '/faculty', icon: Users },
    { name: 'Professional Contributions', path: '/contributions', icon: Award },
    { name: 'Reports & Insights', path: '/reports', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Research &</h2>
        <h2 style={{ color: 'white', fontSize: '1.25rem' }}>Faculty Portal</h2>
      </div>
      
      <nav style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: isActive ? 'var(--color-secondary)' : '#E2E5E8',
                backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderRight: isActive ? '4px solid var(--color-secondary)' : '4px solid transparent',
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 400
              })}
            >
              <Icon size={20} style={{ marginRight: '1rem' }} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          style={{ 
            display: 'flex', alignItems: 'center', color: '#E2E5E8', 
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.75rem 0', width: '100%', textAlign: 'left'
          }}
        >
          <Settings size={20} style={{ marginRight: '1rem' }} />
          <span>Settings</span>
        </button>
        <button 
          onClick={() => navigate('/login')}
          style={{ 
            display: 'flex', alignItems: 'center', color: '#E2E5E8', 
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.75rem 0', width: '100%', textAlign: 'left',
            marginTop: '0.5rem'
          }}
        >
          <LogOut size={20} style={{ marginRight: '1rem' }} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
