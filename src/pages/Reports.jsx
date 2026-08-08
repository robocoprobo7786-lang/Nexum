import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReportsData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading reports...</div>;

  const COLORS = ['#1B365D', '#C5A059', '#64748b', '#94a3b8'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Reports & Insights</h1>
          <p style={{ color: 'var(--color-text-neutral)' }}>Research activity and publication trends across the institution.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline"><Filter size={18} style={{ marginRight: '0.5rem' }} /> Academic Year</Button>
          <Button variant="outline"><Filter size={18} style={{ marginRight: '0.5rem' }} /> Department</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Publications by Year</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.publicationsByYear || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E5E8" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Publication Type Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.publicationTypes || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {(data?.publicationTypes || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {(data?.publicationTypes || []).map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: COLORS[index % COLORS.length], marginRight: '0.5rem', borderRadius: '2px' }} />
                {entry.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Faculty-wise Publications</h3>
          <p style={{ color: 'var(--color-text-neutral)' }}>Detailed report available via backend connection.</p>
        </Card>
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Department-wise Publications</h3>
          <p style={{ color: 'var(--color-text-neutral)' }}>Detailed report available via backend connection.</p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
