import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../../components/MapView';
import ComplaintCard from '../../components/ComplaintCard';

const CitizenDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [category, setCategory] = useState('General');
    const [image, setImage] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Handle Theme Toggle
    useEffect(() => {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

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
                return;
            }
        } catch (err) {
            console.log('Backend not reachable, using local state');
        }

        const localData = JSON.parse(localStorage.getItem('mockComplaints_v11') || 'null');
        if (localData) {
            setComplaints(localData);
        } else {
            const initialMockData = [
                {
                    id: 101,
                    title: 'Pothole on 5th Ave Fixed',
                    description: 'Large pothole was reported and has now been fixed. Road is smooth now.',
                    category: 'Roads',
                    status: 'RESOLVED',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    assignedOfficer: { id: 2, username: 'worker1', fullName: 'Bob Worker' },
                    image: '/pothole_before.png',
                    resolutionImage: '/pothole_after.png',
                    latitude: 13.0827,
                    longitude: 80.2707,
                    upvotes: 12
                },
                {
                    id: 102,
                    title: 'Broken Streetlight #42',
                    description: 'Streetlight is flickering in the dark. Requires maintenance.',
                    category: 'Utilities',
                    status: 'IN_PROGRESS',
                    createdAt: new Date(Date.now() - 4000000).toISOString(),
                    assignedOfficer: { id: 2, username: 'worker1', fullName: 'Bob Worker' },
                    image: '/broken_streetlight.png',
                    latitude: 13.0850,
                    longitude: 80.2750,
                    upvotes: 5
                },
                {
                    id: 103,
                    title: 'Garbage Pileup Sector 4',
                    description: 'Trash has not been collected for 3 days.',
                    category: 'Sanitation',
                    status: 'PENDING',
                    createdAt: new Date(Date.now() - 2000000).toISOString(),
                    image: '/garbage_pileup.png',
                    latitude: 13.0810,
                    longitude: 80.2650,
                    upvotes: 2
                },
                {
                    id: 104,
                    title: 'Fallen Tree Blocking Road',
                    description: 'A large tree has collapsed after the recent storm and is completely blocking traffic flow. Needs clearance.',
                    category: 'Roads',
                    status: 'PENDING',
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                    image: '/fallen_tree.png',
                    latitude: 13.0900,
                    longitude: 80.2600,
                    upvotes: 45
                },
                {
                    id: 105,
                    title: 'Extremely Dangerous Open Manhole',
                    description: 'Manhole cover has been displaced, leaving a deep exposed hole in the middle of a busy residential street.',
                    category: 'Roads',
                    status: 'ASSIGNED',
                    createdAt: new Date(Date.now() - 5000000).toISOString(),
                    assignedOfficer: { id: 3, username: 'worker2', fullName: 'Alice Tech' },
                    image: '/open_manhole.png',
                    latitude: 13.0880,
                    longitude: 80.2500,
                    upvotes: 21
                },
                {
                    id: 106,
                    title: 'Sewer Drainage Overflow',
                    description: 'Sewer system has backed up and is heavily overflowing onto the dirt sidewalks creating a biohazard.',
                    category: 'Sanitation',
                    status: 'ASSIGNED',
                    createdAt: new Date(Date.now() - 15000000).toISOString(),
                    assignedOfficer: { id: 4, username: 'worker3', fullName: 'Rajesh Kumar' },
                    image: '/sewage.jpg',
                    latitude: 13.0780,
                    longitude: 80.2550,
                    upvotes: 38
                },
                {
                    id: 107,
                    title: 'Broken Park Bench',
                    description: 'One of the wooden seating slats is missing on the park bench near the entrance. A simple fix needed.',
                    category: 'General',
                    status: 'PENDING',
                    createdAt: new Date(Date.now() - 800000).toISOString(),
                    image: '/bench.jpg',
                    latitude: 13.0800,
                    longitude: 80.2680,
                    upvotes: 4
                }
            ];
            localStorage.setItem('mockComplaints_v11', JSON.stringify(initialMockData));
            setComplaints(initialMockData);
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

    const handleAITriage = (e) => {
        e.preventDefault();
        if (!image) {
            alert("Please upload a photo first so the AI can analyze it!");
            return;
        }
        setIsAnalyzing(true);
        setTimeout(() => {
            setCategory('Roads');
            setNewTitle('🚨 AI Detected: Infrastructure Hazard');
            setNewDesc('AI Analysis: High confidence of road surface degradation. Immediate attention recommended to prevent traffic accidents.');
            setIsAnalyzing(false);
        }, 1500);
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
                return;
            }
        } catch (err) {
            console.log('Failed to reach backend');
        }

        // Mock add for demo
        const newC = { ...complaint, id: Date.now(), status: 'PENDING', createdAt: new Date().toISOString() };
        const updated = [...complaints, newC];
        setComplaints(updated);
        localStorage.setItem('mockComplaints_v11', JSON.stringify(updated));
        setShowForm(false);
        setNewTitle('');
        setNewDesc('');
        setCategory('General');
        setImage(null);
    };

    const handleUpvote = async (id) => {
        try {
            const res = await fetch(`/api/complaints/${id}/upvote`, { method: 'PUT' });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(complaints.map(c => c.id === id ? updated : c));
                return;
            }
        } catch (err) { console.error(err); }

        const updated = complaints.map(c => c.id === id ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c);
        setComplaints(updated);
        localStorage.setItem('mockComplaints_v11', JSON.stringify(updated));
    };

    const quickReports = [
        { title: 'Pothole in Main St', desc: 'Large pothole causing traffic slowdown.', cat: 'Roads', img: '/pothole_before.png' },
        { title: 'Garbage Pileup', desc: 'Trash has not been collected for 3 days in Sector 4.', cat: 'Sanitation', img: '/garbage_pileup.png' },
        { title: 'Broken Streetlight', desc: 'Streetlight pole #45 is flickering and dark.', cat: 'Utilities', img: '/broken_streetlight.png' },
        { title: 'Water Pipe Leak', desc: 'Clean water leaking from main supply pipe near park.', cat: 'Utilities', img: '/burst_waterpipe.png' }
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header animate-fade-in">
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Citizen Portal</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{user.username || 'Citizen'}</span></p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            🏆 {complaints.filter(c => c.status === 'RESOLVED').length * 50 + complaints.length * 10} Civic Points
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Neighborhood Hero</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <button 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', fontSize: '1.2rem', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px' }}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '12px', display: 'flex', border: '1px solid var(--glass-border)' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '0.6rem 1.25rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.3s'
                            }}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            style={{
                                background: viewMode === 'map' ? 'var(--secondary)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '0.6rem 1.25rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.3s'
                            }}
                        >
                            Map 🗺️
                        </button>
                    </div>

                    <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel Report' : '+ New Issue'}
                    </button>

                    <button className="btn-secondary" onClick={() => {
                        localStorage.removeItem('user');
                        navigate('/login');
                    }}>Logout</button>
                </div>
            </header>

            {viewMode === 'map' && !showForm ? (
                <div className="animate-fade-in glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <MapView complaints={complaints} />
                </div>
            ) : (
                <>
                    {/* DEMO Suggestion Section */}
                    {!showForm && complaints.length === 0 && (
                        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '3rem', borderLeft: '6px solid var(--primary)', animationDelay: '0.1s' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.6rem' }}>🚀 Quick Demo: Report Common Issues</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {quickReports.map((item, idx) => (
                                    <div key={idx}
                                        style={{
                                            padding: '1.5rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            border: '1px solid var(--glass-border)',
                                            transition: 'transform 0.2s, border-color 0.2s'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        onClick={() => {
                                            setNewTitle(item.title);
                                            setNewDesc(item.desc);
                                            setCategory(item.cat);
                                            setImage(item.img);
                                            setShowForm(true);
                                        }}
                                    >
                                        <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-main)' }}>{item.title}</h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>{item.cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {showForm && (
                        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', marginBottom: '3rem' }}>
                            <h3 style={{ marginBottom: '2rem', fontSize: '2rem' }}>File a New Issue</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <input
                                        className="glass-input"
                                        placeholder="Issue Title (e.g., Pothole on 5th Ave)"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required
                                    />
                                    <select
                                        className="glass-input"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{ appearance: 'none' }}
                                    >
                                        <option value="General">📍 General</option>
                                        <option value="Roads">🚧 Roads & Traffic</option>
                                        <option value="Sanitation">🗑️ Sanitation</option>
                                        <option value="Utilities">💡 Utilities</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <textarea
                                        className="glass-input"
                                        rows="5"
                                        placeholder="Describe the issue in detail. What exactly is wrong? How does it affect the community?..."
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        required
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                {/* Photo Upload Section */}
                                <div style={{ marginBottom: '2.5rem', padding: '2rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)' }}>
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
                                                <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px', border: '1px solid var(--glass-border)' }} />
                                                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Click to change photo</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
                                                <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '500' }}>Upload Photo Evidence</p>
                                                <span style={{ fontSize: '0.9rem' }}>Click to browse or drag & drop</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <button onClick={handleAITriage} type="button" className="btn-secondary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                                        {isAnalyzing ? "🤖 AI Analyzing..." : "🤖 Auto-Triage Form with AI"}
                                    </button>
                                </div>

                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem' }}>🎯 Submit Report for City Review</button>
                            </form>
                        </div>
                    )}

                    <div className="complaint-grid" style={{ marginBottom: '4rem' }}>
                        {complaints.length === 0 ? (
                            !showForm && <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                                No issues reported yet. Be the first to improve your neighborhood!
                            </div>
                        ) : (
                            complaints.map((c, idx) => (
                                <div key={c.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <ComplaintCard complaint={c}>
                                        {/* Action: Upraise Urgency */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                                            <button
                                                onClick={() => handleUpvote(c.id)}
                                                className="btn-secondary"
                                                style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                                            >
                                                <span style={{ fontSize: '1.2rem' }}>🔥</span> Upvote Request
                                            </button>

                                            <span style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--text-muted)' }}>
                                                {c.category || 'General'}
                                            </span>
                                        </div>

                                        {/* Status Timeline */}
                                        <div className="timeline-container" style={{ marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Request Tracker</h4>
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

                                        {/* Resolution Proof is now handled in ComplaintCard */}
                                    </ComplaintCard>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )
            }
        </div >
    );
};

export default CitizenDashboard;
