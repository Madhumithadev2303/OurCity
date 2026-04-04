import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintCard from '../../components/ComplaintCard';

const WorkerDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [resolutionImage, setResolutionImage] = useState({}); // Map of complaintId -> base64
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch complaints
    useEffect(() => {
        if (!user.username || user.role !== 'OFFICER') {
            // navigate('/login');
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await fetch('/api/complaints');
            if (res.ok) {
                const allData = await res.json();
                const myTasks = allData.filter(c =>
                    (c.assignedOfficer && (c.assignedOfficer.id === user.id || c.assignedOfficer.username === user.username)) ||
                    c.status === 'ASSIGNED'
                );
                setComplaints(myTasks);
                return;
            }
        } catch (err) {
            console.log('Backend err', err);
        }

        let localData = JSON.parse(localStorage.getItem('mockComplaints_v11') || '[]');
        
        let myTasks = localData.filter(c => 
            c.assignedOfficer && (c.assignedOfficer.id === user.id || c.assignedOfficer.username === user.username)
        );

        // If the worker has no active tasks, let's assign a specific one automatically for demonstration!
        if (myTasks.length === 0) {
            const specificTask = {
                id: Date.now() + Math.floor(Math.random() * 1000),
                title: 'Emergency: Burst Water Main on 1st Street',
                description: 'A major water line has ruptured causing flooding. Immediate repair required to prevent further infrastructure damage.',
                category: 'Utilities',
                status: 'ASSIGNED',
                createdAt: new Date().toISOString(),
                assignedOfficer: user, // Assign to the current worker
                image: '/burst_waterpipe.png',
                latitude: 13.0820,
                longitude: 80.2710,
                upvotes: 45
            };
            
            localData.push(specificTask);
            localStorage.setItem('mockComplaints_v11', JSON.stringify(localData));
            myTasks = [specificTask];
        }

        setComplaints(myTasks);
    };

    const handleImageRead = (e, complaintId) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResolutionImage(prev => ({ ...prev, [complaintId]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResolve = async (complaintId) => {
        const img = resolutionImage[complaintId];
        if (!img) {
            alert("Please upload a photo of the completed work before resolving.");
            return;
        }

        try {
            const res = await fetch(`/api/complaints/${complaintId}/resolve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'RESOLVED',
                    resolutionImage: img
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(complaints.map(c => c.id === complaintId ? updated : c));
                return;
            }
        } catch (err) {
            console.error("Failed to resolve", err);
        }

        const localData = JSON.parse(localStorage.getItem('mockComplaints_v11') || '[]');
        const updatedData = localData.map(c => c.id === complaintId ? { ...c, status: 'RESOLVED', resolutionImage: img } : c);
        localStorage.setItem('mockComplaints_v11', JSON.stringify(updatedData));
        setComplaints(updatedData.filter(c => c.assignedOfficer && (c.assignedOfficer.id === user.id || c.assignedOfficer.username === user.username)));
    };

    const handleStatusChange = async (id, newStatus) => {
        if (newStatus === 'RESOLVED') return;

        try {
            const res = await fetch(`/api/complaints/${id}/status?status=${newStatus}`, { method: 'PUT' });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(complaints.map(c => c.id === id ? updated : c));
                return;
            }
        } catch (err) { console.error(err); }

        const localData = JSON.parse(localStorage.getItem('mockComplaints_v11') || '[]');
        const updatedData = localData.map(c => c.id === id ? { ...c, status: newStatus } : c);
        localStorage.setItem('mockComplaints_v11', JSON.stringify(updatedData));
        setComplaints(updatedData.filter(c => c.assignedOfficer && (c.assignedOfficer.id === user.id || c.assignedOfficer.username === user.username)));
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header animate-fade-in">
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Field Operations Portal</h1>
                    <p style={{ color: 'var(--text-muted)' }}>City Worker ID: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>#{user.id} {user.fullName}</span></p>
                </div>
                <button className="btn-secondary" onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                }}>Logout Shift</button>
            </header>

            {/* Active Workers Roster */}
            <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', overflowX: 'auto' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>📍 Active Field Crew:</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                        { id: 2, fullName: 'Bob Worker', status: 'On Route', color: 'var(--warning)' },
                        { id: 3, fullName: 'Alice Tech', status: 'Fixing', color: 'var(--secondary)' },
                        { id: 4, fullName: 'Rajesh Kumar', status: 'Investigating', color: 'var(--primary)' },
                        { id: 5, fullName: 'Priya Sharma', status: 'Available', color: 'var(--success)' }
                    ].map(w => (
                        <div key={w.id} style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', 
                            padding: '0.5rem 1rem', borderRadius: '12px', border: `1px solid ${w.id === user.id ? 'var(--primary)' : 'var(--glass-border)'}` 
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: w.color, boxShadow: `0 0 8px ${w.color}` }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: w.id === user.id ? 'bold' : '500', color: w.id === user.id ? 'var(--primary)' : 'var(--text-main)', whiteSpace: 'nowrap' }}>
                                    {w.fullName} {w.id === user.id && '(You)'}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{w.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>🚧</span> Your Active Dispatch Queue
            </h2>

            <div className="complaint-grid" style={{ marginBottom: '4rem' }}>
                {complaints.length === 0 ? (
                    <div className="glass-panel animate-fade-in" style={{ gridColumn: '1/-1', padding: '5rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🛌</div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>No Active Assignments</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>You're all caught up! The Dispatch Center will assign tasks here.</p>
                    </div>
                ) : (
                    complaints.map((c, idx) => (
                        <div key={c.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                            <ComplaintCard complaint={c}>
                                {/* Field Worker Utilities Overlay */}

                                {c.status !== 'RESOLVED' ? (
                                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px dashed var(--glass-border)' }}>

                                        {/* Status Control */}
                                        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Progress Step</label>
                                                <select
                                                    className="glass-input"
                                                    value={c.status}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'RESOLVED') return;
                                                        handleStatusChange(c.id, e.target.value);
                                                    }}
                                                    style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)' }}
                                                >
                                                    <option value="ASSIGNED">🛠️ Acknowledged / Assigned</option>
                                                    <option value="IN_PROGRESS">🚜 In Progress at Site</option>
                                                    <option value="RESOLVED" disabled>✅ Resolved (Use Check-Out)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Photo Evidence Submission Tool */}
                                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                            <label style={{ fontSize: '1.1rem', color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                                🏁 Job Site Check-Out
                                            </label>

                                            <input
                                                type="file"
                                                id={`file-${c.id}`}
                                                accept="image/*"
                                                onChange={(e) => handleImageRead(e, c.id)}
                                                style={{ display: 'none' }}
                                            />

                                            <label htmlFor={`file-${c.id}`} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '1.5rem',
                                                textAlign: 'center',
                                                border: '2px dashed rgba(16, 185, 129, 0.4)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                marginBottom: '1rem',
                                                background: resolutionImage[c.id] ? 'rgba(0,0,0,0.4)' : 'transparent',
                                                transition: 'all 0.2s',
                                                color: 'var(--text-main)'
                                            }}
                                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--success)'}
                                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
                                            >
                                                <div style={{ fontSize: '2rem' }}>{resolutionImage[c.id] ? '🖼️' : '📸'}</div>
                                                {resolutionImage[c.id]
                                                    ? <span style={{ color: 'var(--success)', fontWeight: '500' }}>Photo Verified. Ready to Submit.</span>
                                                    : <span style={{ color: 'var(--text-muted)' }}>Tap to Upload 'Fixed' Photo</span>}
                                            </label>

                                            {resolutionImage[c.id] && (
                                                <button
                                                    onClick={() => handleResolve(c.id)}
                                                    style={{
                                                        width: '100%',
                                                        background: 'var(--success)',
                                                        color: '#000',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.1rem',
                                                        padding: '1rem',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                                                    }}
                                                >
                                                    Mark Fix as Completed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                        <p style={{ color: 'var(--success)', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>🎉 Work Logged & Complete</p>
                                    </div>
                                )}
                            </ComplaintCard>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default WorkerDashboard;
