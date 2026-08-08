import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { ArrowLeft, UploadCloud, X, Plus, Check, FileText } from 'lucide-react';

const AddPublication = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Journal Article',
    journal: '',
    year: new Date().getFullYear().toString(),
    doi: '',
    authors: [],
    evidenceFile: null
  });

  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [authorType, setAuthorType] = useState('Internal Faculty'); // or 'External Author'
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [extAuthorName, setExtAuthorName] = useState('');
  const [extAuthorInst, setExtAuthorInst] = useState('');

  useEffect(() => {
    // Load faculty for the dropdown
    api.getFacultyList().then(setFacultyList).catch(console.error);
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleAddAuthor = () => {
    if (authorType === 'Internal Faculty') {
      const fac = facultyList.find(f => f.id === selectedFaculty);
      if (fac) {
        setFormData(prev => ({
          ...prev,
          authors: [...prev.authors, { id: `new_${Date.now()}`, name: fac.name, type: 'Internal Faculty', facultyId: fac.id }]
        }));
      }
    } else {
      if (extAuthorName) {
        setFormData(prev => ({
          ...prev,
          authors: [...prev.authors, { id: `new_${Date.now()}`, name: extAuthorName, type: 'External Author', institution: extAuthorInst }]
        }));
      }
    }
    setAuthorModalOpen(false);
    setSelectedFaculty('');
    setExtAuthorName('');
    setExtAuthorInst('');
  };

  const removeAuthor = (id) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter(a => a.id !== id)
    }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, evidenceFile: e.dataTransfer.files[0] }));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, evidenceFile: e.target.files[0] }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.addPublication(formData);
      navigate('/publications');
      // In real app, show toast
    } catch (err) {
      console.error(err);
      alert('Failed to save publication');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
      {[1, 2, 3, 4].map(s => (
        <div key={s} style={{ 
          flex: 1, 
          height: '4px', 
          backgroundColor: s <= step ? 'var(--color-secondary)' : 'var(--color-border)',
          borderRadius: '2px',
          transition: 'background-color 0.3s'
        }} />
      ))}
    </div>
  );

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/publications')} style={{ marginBottom: '1.5rem', padding: 0 }}>
        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Publications
      </Button>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem' }}>Add Publication</h1>
          <p style={{ color: 'var(--color-text-neutral)' }}>Enter publication details and supporting evidence.</p>
        </div>

        {renderStepIndicator()}

        <Card style={{ padding: '2.5rem' }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 1: Publication Details</h2>
              <Input 
                label="Publication Title *" 
                id="title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                style={{ marginBottom: '1rem' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Publication Type *</label>
                  <select 
                    className="input" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Journal Article</option>
                    <option>Conference Paper</option>
                    <option>Book Chapter</option>
                    <option>Patent</option>
                  </select>
                </div>
                <Input 
                  label="Year *" 
                  id="year" 
                  value={formData.year} 
                  onChange={e => setFormData({...formData, year: e.target.value})} 
                />
              </div>
              <Input 
                label="Journal / Conference *" 
                id="journal" 
                value={formData.journal} 
                onChange={e => setFormData({...formData, journal: e.target.value})} 
                style={{ marginBottom: '1rem' }}
              />
              <Input 
                label="DOI / Reference" 
                id="doi" 
                value={formData.doi} 
                onChange={e => setFormData({...formData, doi: e.target.value})} 
                style={{ marginBottom: '2rem' }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleNext} disabled={!formData.title || !formData.journal}>Next Step</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Step 2: Authors</h2>
                <Button variant="outline" size="sm" onClick={() => setAuthorModalOpen(true)}>
                  <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add Author
                </Button>
              </div>

              {formData.authors.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <p style={{ color: 'var(--color-text-neutral)' }}>No authors added yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {formData.authors.map((author, index) => (
                    <div key={author.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <span style={{ fontWeight: 500, marginRight: '1rem' }}>{index + 1}. {author.name}</span>
                        <Badge variant={author.type === 'Internal Faculty' ? 'internal' : 'external'}>{author.type}</Badge>
                        {author.type === 'External Author' && author.institution && (
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', marginLeft: '1rem' }}>{author.institution}</span>
                        )}
                      </div>
                      <button onClick={() => removeAuthor(author.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outline" onClick={handlePrev}>Previous</Button>
                <Button onClick={handleNext} disabled={formData.authors.length === 0}>Next Step</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 3: Evidence</h2>
              <p style={{ color: 'var(--color-text-neutral)', marginBottom: '1.5rem' }}>Upload supporting documentation for this publication.</p>
              
              <div 
                style={{ 
                  border: '2px dashed var(--color-border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '4rem 2rem', 
                  textAlign: 'center',
                  backgroundColor: 'var(--color-background)',
                  marginBottom: '2rem'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {formData.evidenceFile ? (
                  <div>
                    <FileText size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
                    <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{formData.evidenceFile.name}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', marginBottom: '1rem' }}>{(formData.evidenceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, evidenceFile: null})}>Remove File</Button>
                  </div>
                ) : (
                  <div>
                    <UploadCloud size={48} style={{ color: 'var(--color-text-neutral)', margin: '0 auto 1rem' }} />
                    <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Drag & drop PDF here</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-neutral)', marginBottom: '1.5rem' }}>Maximum file size: 10MB</p>
                    <label>
                      <span className="btn btn-outline btn-sm">Browse files</span>
                      <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileSelect} />
                    </label>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outline" onClick={handlePrev}>Previous</Button>
                <Button onClick={handleNext}>Review</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 4: Review & Save</h2>
              
              <div style={{ backgroundColor: 'var(--color-background)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-neutral)', marginBottom: '0.25rem' }}>Publication Title</h4>
                  <p style={{ fontWeight: 500, fontSize: '1.125rem', color: 'var(--color-primary)' }}>{formData.title}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-neutral)', marginBottom: '0.25rem' }}>Type & Year</h4>
                    <p>{formData.type} &middot; {formData.year}</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-neutral)', marginBottom: '0.25rem' }}>Journal / Conference</h4>
                    <p>{formData.journal}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-neutral)', marginBottom: '0.5rem' }}>Authors ({formData.authors.length})</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {formData.authors.map(a => (
                      <li key={a.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>{a.name}</span>
                        <Badge variant={a.type === 'Internal Faculty' ? 'internal' : 'external'}>{a.type}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                {formData.evidenceFile && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-neutral)', marginBottom: '0.25rem' }}>Evidence</h4>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} color="var(--color-success)" /> {formData.evidenceFile.name}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outline" onClick={handlePrev} disabled={loading}>Previous</Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Publication'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Author Modal */}
      {authorModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <Card style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Add Author</h3>
              <button onClick={() => setAuthorModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Author Type</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="authType" checked={authorType === 'Internal Faculty'} onChange={() => setAuthorType('Internal Faculty')} />
                  Internal Faculty
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="authType" checked={authorType === 'External Author'} onChange={() => setAuthorType('External Author')} />
                  External Author
                </label>
              </div>
            </div>

            {authorType === 'Internal Faculty' ? (
              <div className="form-group">
                <label className="form-label">Select Faculty</label>
                <select className="input" value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)}>
                  <option value="">-- Select Faculty --</option>
                  {facultyList.map(f => (
                    <option key={f.id} value={f.id}>{f.name} - {f.department}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <Input label="Author Name *" id="extName" value={extAuthorName} onChange={e => setExtAuthorName(e.target.value)} style={{ marginBottom: '1rem' }} />
                <Input label="Institution" id="extInst" value={extAuthorInst} onChange={e => setExtAuthorInst(e.target.value)} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button variant="ghost" onClick={() => setAuthorModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAuthor} disabled={authorType === 'Internal Faculty' ? !selectedFaculty : !extAuthorName}>
                Add Author
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddPublication;
