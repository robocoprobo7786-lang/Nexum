import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Mail, Briefcase, ArrowLeft } from 'lucide-react';

const FacultyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Publications');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [facData, pubsData] = await Promise.all([
          api.getFacultyProfile(id),
          api.getPublications({ facultyId: id })
        ]);
        setFaculty(facData);
        setPublications(pubsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;
  if (!faculty) return <div style={{ padding: '2rem' }}>Faculty not found.</div>;

  // Group publications by year
  const pubsByYear = publications.reduce((acc, pub) => {
    acc[pub.year] = acc[pub.year] || [];
    acc[pub.year].push(pub);
    return acc;
  }, {});

  const sortedYears = Object.keys(pubsByYear).sort((a, b) => b - a);

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/faculty')} style={{ marginBottom: '1.5rem', padding: 0 }}>
        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Faculty
      </Button>

      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            backgroundColor: 'var(--color-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-serif)'
          }}>
            {faculty.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{faculty.name}</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-neutral)', marginBottom: '1rem' }}>
              {faculty.designation}, Department of {faculty.department}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-neutral)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ marginRight: '0.5rem' }} /> {faculty.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Briefcase size={16} style={{ marginRight: '0.5rem' }} /> Faculty ID: {faculty.id.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>{faculty.publicationsCount}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-neutral)', fontWeight: 600 }}>Publications</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>{faculty.contributionsCount}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-neutral)', fontWeight: 600 }}>Professional Contributions</div>
          </div>
        </div>
      </Card>

      <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Publications', 'Contributions', 'Profile'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--color-secondary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-neutral)',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Publications' && (
        <div>
          {publications.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--color-text-neutral)' }}>No publications found for this faculty member.</p>
            </Card>
          ) : (
            sortedYears.map(year => (
              <div key={year} style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>{year}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pubsByYear[year].map(pub => (
                    <Card key={pub.id} style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {pub.type}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>{pub.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', marginBottom: '0.5rem' }}>
                        Authors: <span style={{ color: 'var(--color-text-dark)', fontWeight: 500 }}>{pub.authors.map(a => a.name).join(' · ')}</span>
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', marginBottom: '1rem' }}>
                        {pub.journal} &middot; {pub.year}
                      </p>
                      {pub.doi && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-neutral)', marginBottom: '1.5rem' }}>
                          DOI: {pub.doi}
                        </p>
                      )}
                      <div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/publications/${pub.id}`)}>
                          View Details &rarr;
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'Contributions' && (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-neutral)' }}>Contributions will be displayed here.</p>
        </Card>
      )}
      
      {activeTab === 'Profile' && (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-neutral)' }}>Detailed profile information will be displayed here.</p>
        </Card>
      )}
    </div>
  );
};

export default FacultyProfile;
