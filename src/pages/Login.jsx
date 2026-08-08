import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Using mock API
    try {
      await api.login({ universityId: 'admin', password: 'password' });
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. For demo, just click Sign In.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--color-background)'
    }}>
      <Card style={{ width: '100%', maxWidth: '480px', padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '50%', marginBottom: '1rem' }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Faculty Portal</h1>
          <p style={{ color: 'var(--color-text-neutral)' }}>Sign in to access your research and academic profile.</p>
        </div>

        {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <Input 
            label="University ID" 
            id="uid" 
            placeholder="Enter your ID" 
            defaultValue="admin"
          />
          <Input 
            label="Password" 
            id="pwd" 
            type="password" 
            placeholder="Enter your password" 
            defaultValue="password"
            style={{ marginBottom: '0.5rem' }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} />
              <span style={{ color: 'var(--color-text-neutral)' }}>Remember me</span>
            </label>
            <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Forgot Password?</a>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Authorized Access Only
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-primary)' }}>
            <a href="#">Institutional Support</a>
            <span>&middot;</span>
            <a href="#">Privacy Policy</a>
            <span>&middot;</span>
            <a href="#">Terms of Service</a>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-neutral)', marginTop: '1rem' }}>
            &copy; 2026 University Research Department
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
