import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ArrowLeft, FileText, Check } from 'lucide-react';

const PublicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublicationById(id)
      .then(setPublication)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading details...</div>;
  if (!publication) return <div style={{ padding: '2rem' }}>Publication not found.</div>;

  const internals = publication.authors.filter(a => a.type === 'Internal Faculty');
  const externals = publication.authors.filter(a => a.type === 'External Author');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/publications')} style={{ marginBottom: '1.5rem', padding: 0 }}>
        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Publications
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Badge style={{ marginBottom: '1rem' }}>{publication.type}</Badge>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{publication.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline">Edit</Button>
          <Button variant="outline">More</Button>
        </div>
      </div>

      <Card style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Authors</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', textTransform: 'uppercase', marginBottom: '1rem' }}>Internal Faculty</h4>
            {internals.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {internals.map(a => (
                  <li key={a.id} style={{ marginBottom: '0.75rem', fontWeight: 500, color: 'var(--color-primary)' }}>{a.name}</li>
                ))}
              </ul>
            ) : <p style={{ color: 'var(--color-text-neutral)' }}>None</p>}
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', textTransform: 'uppercase', marginBottom: '1rem' }}>External Authors</h4>
            {externals.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {externals.map(a => (
                  <li key={a.id} style={{ marginBottom: '0.75rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                    {a.name}
                    {a.institution && <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-neutral)', fontWeight: 400 }}>{a.institution}</span>}
                  </li>
                ))}
              </ul>
            ) : <p style={{ color: 'var(--color-text-neutral)' }}>None</p>}
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Publication Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-neutral)', textTransform: 'uppercase' }}>Journal / Conference</div>
              <div style={{ fontWeight: 500 }}>{publication.journal}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-neutral)', textTransform: 'uppercase' }}>Year</div>
              <div style={{ fontWeight: 500 }}>{publication.year}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-neutral)', textTransform: 'uppercase' }}>DOI / Reference</div>
              <div style={{ fontWeight: 500 }}>{publication.doi || 'N/A'}</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Evidence</h3>
          {publication.evidenceFile ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--color-primary)" />
                <span style={{ fontWeight: 500 }}>{typeof publication.evidenceFile === 'string' ? publication.evidenceFile : publication.evidenceFile.name}</span>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-neutral)' }}>No evidence uploaded.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PublicationDetails;
