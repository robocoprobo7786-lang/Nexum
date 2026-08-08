import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BookOpen, Users, Calendar, Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPubs, setRecentPubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, publications] = await Promise.all([
          api.getDashboardStats(),
          api.getPublications()
        ]);
        setStats(dashboardStats);
        setRecentPubs(publications.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-neutral)' }}>Research activity overview and publication insights across your institution.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/publications/add')}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Publication
        </Button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Card style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)', marginRight: '1rem' }}>
            <BookOpen size={24} color="var(--color-primary)" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Publications</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{stats?.totalPublications}</h3>
          </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)', marginRight: '1rem' }}>
            <Users size={24} color="var(--color-primary)" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faculty</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{stats?.faculty}</h3>
          </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)', marginRight: '1rem' }}>
            <Calendar size={24} color="var(--color-primary)" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Year</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{stats?.thisYear}</h3>
          </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)', marginRight: '1rem' }}>
            <Building2 size={24} color="var(--color-primary)" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Departments</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{stats?.departments < 10 ? `0${stats.departments}` : stats.departments}</h3>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Simple mock charts using CSS since we don't need a heavy chart lib just for visual representation if recharts is too complex. Wait, I installed recharts, I'll use it in Reports. Here I will just mock simple visual bars */}
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Publications by Year</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingTop: '20px' }}>
             {[ {y:'2022', h: 40}, {y:'2023', h: 60}, {y:'2024', h: 80}, {y:'2025', h: 100}, {y:'2026', h: 70} ].map(bar => (
                <div key={bar.y} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                  <div style={{ width: '100%', height: `${bar.h}px`, backgroundColor: 'var(--color-primary)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }}></div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--color-text-neutral)' }}>{bar.y}</span>
                </div>
             ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Publication Type Distribution</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', height: '200px' }}>
              {[
                { label: 'Journal Article', pct: 65, color: 'var(--color-primary)' },
                { label: 'Conference Paper', pct: 45, color: 'var(--color-secondary)' },
                { label: 'Book Chapter', pct: 12, color: '#94a3b8' }
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 600 }}>{item.pct}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
           </div>
        </Card>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Publications</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recentPubs.map(pub => (
          <Card key={pub.id} style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                {pub.type} &middot; {pub.year}
              </div>
              <h4 style={{ fontSize: '1.125rem', margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>{pub.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', margin: 0 }}>
                {pub.authors.map(a => a.name).join(' · ')}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(`/publications/${pub.id}`)}>
              View Details &rarr;
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
