import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const data = await api.getPublications({ search });
        setPublications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchPublications();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Publications</h1>
          <p style={{ color: 'var(--color-text-neutral)' }}>Manage and track scholarly publications and research output.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/publications/add')}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Publication
        </Button>
      </div>

      <Card style={{ marginBottom: '2rem', padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-neutral)' }} />
          <input 
            type="text" 
            placeholder="Search publications, DOI or authors..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline"><Filter size={18} style={{ marginRight: '0.5rem' }} /> Type</Button>
          <Button variant="outline"><Filter size={18} style={{ marginRight: '0.5rem' }} /> Year</Button>
          <Button variant="outline"><Filter size={18} style={{ marginRight: '0.5rem' }} /> Department</Button>
        </div>
      </Card>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-neutral)' }}>Loading publications...</div>
      ) : publications.length === 0 ? (
        <Card style={{ padding: '4rem', textAlign: 'center' }}>
          <BookOpen size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-border)' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No publications found</h3>
          <p style={{ color: 'var(--color-text-neutral)', marginBottom: '1.5rem' }}>Try changing your search or filters.</p>
          <Button variant="outline" onClick={() => setSearch('')}>Clear Filters</Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {publications.map(pub => (
            <Card key={pub.id} style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {pub.type}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)' }}>&middot;</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)' }}>{pub.year}</span>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{pub.title}</h3>
                
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', marginBottom: '0.75rem' }}>
                  {pub.authors.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ' · '}
                      <span style={{ color: 'var(--color-text-dark)', fontWeight: 500 }}>{a.name}</span>
                      {a.type === 'External Author' && <span style={{ color: 'var(--color-secondary)', marginLeft: '0.25rem', fontSize: '0.75rem' }}>(Ext)</span>}
                    </span>
                  ))}
                </p>
                
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <span>{pub.journal}</span>
                  {pub.doi && <span>DOI: {pub.doi}</span>}
                  {pub.citationCount !== undefined && <span>Citations: {pub.citationCount}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                <Button variant="outline" size="sm" onClick={() => navigate(`/publications/${pub.id}`)}>View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Quick fix for missing BookOpen icon import
import { BookOpen } from 'lucide-react';
export default Publications;
