import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const data = await api.getFacultyList({ search });
        setFaculty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchFaculty();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem' }}>Faculty</h1>
        <p style={{ color: 'var(--color-text-neutral)' }}>Manage faculty research profiles and publication activity.</p>
      </div>

      <Card style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-neutral)' }} />
          <input 
            type="text" 
            placeholder="Search faculty..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        <Button variant="outline">
          <Filter size={18} style={{ marginRight: '0.5rem' }} /> Department
        </Button>
        <Button variant="outline">
          <Filter size={18} style={{ marginRight: '0.5rem' }} /> Designation
        </Button>
      </Card>

      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-neutral)' }}>Loading faculty...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Designation</th>
                <th style={{ textAlign: 'center' }}>Publications</th>
                <th style={{ textAlign: 'center' }}>Contributions</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {faculty.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No faculty found.</td>
                </tr>
              ) : (
                faculty.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{f.name}</td>
                    <td>{f.department}</td>
                    <td>{f.designation}</td>
                    <td style={{ textAlign: 'center' }}>{f.publicationsCount}</td>
                    <td style={{ textAlign: 'center' }}>{f.contributionsCount}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/faculty/${f.id}`)}>
                        View Profile &rarr;
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Faculty;
