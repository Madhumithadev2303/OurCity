import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../../components/MapView';

const CitizenDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [category, setCategory] = useState('General');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch complaints mock or real
    useEffect(() => {
        if (!user.username) {
            navigate('/login');
            return;
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await fetch('/api/complaints');
            if (res.ok) {
                const data = await res.json();
                setComplaints(data);
            }
        } catch (err) {
            console.log('Backend not reachable, using local state');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const complaint = {
            title: newTitle,
            description: newDesc,
            category: category,
            citizen: { id: user.id },
            image: image,
            // Mock Lat/Lng for demo if not provided
            latitude: 13.0827 + (Math.random() - 0.5) * 0.1,
            longitude: 80.2707 + (Math.random() - 0.5) * 0.1
        };

        try {
            const res = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complaint)
            });
            if (res.ok) {
                const saved = await res.json();
                setComplaints([...complaints, saved]);
                setShowForm(false);
                setNewTitle('');
                setNewDesc('');
                setCategory('General');
                setImage(null);
            }
        } catch (err) {
            // Mock add for demo
            setComplaints([...complaints, { ...complaint, id: Date.now(), status: 'PENDING', createdAt: new Date().toISOString() }]);
            setShowForm(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/complaints/${id}/status?status=${newStatus}`, {
                method: 'PUT'
            });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(complaints.map(c => c.id === id ? updated : c));
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleUpvote = async (id) => {
        try {
            const res = await fetch(`/api/complaints/${id}/upvote`, { method: 'PUT' });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(complaints.map(c => c.id === id ? updated : c));
            }
        } catch (err) { console.error(err); }
    };

    const quickReports = [
        { title: 'Pothole in Main St', desc: 'Large pothole causing traffic slowdown.', cat: 'Roads' },
        { title: 'Garbage Pileup', desc: 'Trash has not been collected for 3 days in Sector 4.', cat: 'Sanitation' },
        { title: 'Broken Streetlight', desc: 'Streetlight pole #45 is flickering and dark.', cat: 'Utilities' },
        { title: 'Water Pipe Leak', desc: 'Clean water leaking from main supply pipe near park.', cat: 'Utilities' }
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Citizen Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.username || 'Citizen'}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '8px', display: 'flex' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            style={{
                                background: viewMode === 'map' ? 'var(--primary)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Map 🗺️
                        </button>
                    </div>

                    <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ New Complaint'}
                    </button>
                </div>
            </header>

            {viewMode === 'map' && !showForm ? (
                <MapView complaints={complaints} />
            ) : (
                <>
                    {/* DEMO Suggestion Section */}
                    {!showForm && complaints.length === 0 && (
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>🚀 Quick Demo: Report Common Issues</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {quickReports.map((item, idx) => (
                                    <div key={idx}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: '1px solid transparent'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                        onClick={() => {
                                            setNewTitle(item.title);
                                            setNewDesc(item.desc);
                                            setShowForm(true);
                                        }}
                                    >
                                        <h4 style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {showForm && (
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>File a Complaint</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <input
                                        className="glass-input"
                                        placeholder="Complaint Title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required
                                    />
                                    <select
                                        className="glass-input"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="General">General</option>
                                        <option value="Roads">Roads & Traffic</option>
                                        <option value="Sanitation">Sanitation</option>
                                        <option value="Utilities">Utilities</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <textarea
                                        className="glass-input"
                                        rows="4"
                                        placeholder="Describe the issue in detail..."
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Photo Upload Section */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '2px dashed var(--glass-border)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block' }}>
                                        {image ? (
                                            <div style={{ position: 'relative' }}>
                                                <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Click to change photo</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>📸</p>
                                                <p>Upload Evidence</p>
                                                <span style={{ fontSize: '0.8rem' }}>Click to select photo</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                <button type="submit" className="btn-primary">Submit Complaint</button>
                            </form>
                        </div>
                    )}

                    <div className="complaint-grid">
                        {complaints.length === 0 ? (
                            <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No complaints found. Start by creating one!
                            </div>
                        ) : (
                            complaints.map(c => (
                                <div key={c.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span className={`status-badge status-${c.status?.toLowerCase() || 'pending'}`}>
                                                {c.status || 'PENDING'}
                                            </span>
                                            {/* Upvote Button */}
                                            <button
                                                onClick={() => handleUpvote(c.id)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '20px',
                                                    padding: '0.2rem 0.6rem',
                                                    color: 'var(--text-main)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                            >
                                                👍 {c.upvotes || 0}
                                            </button>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'}
                                        </span>
                                    </div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{c.title}</h3>

                                    {c.image && (
                                        <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={c.image} alt="Evidence" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                                        </div>
                                    )}

                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', flex: 1 }}>{c.description}</p>

                                    {/* Category Tag Mockup */}
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                            Category: {c.category || 'General'}
                                        </span>
                                    </div>

                                    {/* Resolution/After Photo */}
                                    {c.resolutionImage && (
                                        <div style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--success)' }}>
                                            <p style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>✅ COMPLETED WORK (Resolved)</p>
                                            <img src={c.resolutionImage} alt="Resolution" style={{ width: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}

                                    {/* Status Timeline */}
                                    <div className="timeline-container">
                                        <div className="timeline">
                                            {['Pending', 'Assigned', 'In Progress', 'Resolved'].map((step, idx) => {
                                                const statusOrder = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
                                                const currentStatusIdx = statusOrder.indexOf(c.status) === -1 ? 0 : statusOrder.indexOf(c.status);
                                                const isActive = idx <= currentStatusIdx;

                                                return (
                                                    <div key={step} className={`timeline-step ${isActive ? 'active' : ''}`}>
                                                        <div className="timeline-dot"></div>
                                                        <span>{step}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Assigned Officer Info */}
                                    {c.assignedOfficer && (
                                        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '500', marginBottom: '0.25rem' }}>👷 Assigned Officer</p>
                                            <p style={{ fontSize: '0.9rem' }}>{c.assignedOfficer.fullName || c.assignedOfficer.username}</p>
                                        </div>
                                    )}

                                    {/* Status Update Control (Only for Officers) */}
                                    {user.role !== 'CITIZEN' && (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>🔧 Update Status (Officer View)</label>
                                            <select
                                                className="glass-input"
                                                style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                                                value={c.status}
                                                onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="ASSIGNED">Assigned</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="RESOLVED">Resolved</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CitizenDashboard;
