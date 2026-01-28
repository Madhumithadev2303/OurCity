import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
                // Filter for this worker (Mock logic: if assignedOfficer.id matches current user.id)
                // For demo simplicity, if we are 'ram' or 'karthi' we might see all 'ASSIGNED' tasks or tasks assigned to us.
                // Since the backend might not be fully filtering yet, we do it here.
                const myTasks = allData.filter(c =>
                    (c.assignedOfficer && (c.assignedOfficer.id === user.id || c.assignedOfficer.username === user.username)) ||
                    c.status === 'ASSIGNED' // Fallback for demo: show all Assigned tasks if ownership unclear
                );
                setComplaints(myTasks);
            }
        } catch (err) {
            console.log('Backend err', err);
        }
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
                alert("Task Resolved Successfully!");
            }
        } catch (err) {
            console.error("Failed to resolve", err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        // If they pick Resolved, we handle it via the specialized button.
        if (newStatus === 'RESOLVED') return;

        try {
            const res = await fetch(`/api/complaints/${id}/status?status=${newStatus}`, { method: 'PUT' });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(complaints.map(c => c.id === id ? updated : c));
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Worker Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.fullName || 'Worker'}</p>
                </div>
                <button className="btn-primary" onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                }}>Logout</button>
            </header>

            <div className="complaint-grid">
                {complaints.length === 0 ? (
                    <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center' }}>
                        <h3>No Application Tasks Assigned</h3>
                        <p style={{ color: 'var(--text-muted)' }}>You will be notified when the Supervisor assigns you a task.</p>
                    </div>
                ) : (
                    complaints.map(c => (
                        <div key={c.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span className={`status-badge status-${c.status?.toLowerCase()}`}>
                                    {c.status}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#ID-{c.id}</span>
                            </div>

                            <h3 style={{ marginBottom: '0.5rem' }}>{c.title}</h3>

                            {/* Original Complaint Photo */}
                            {c.image && (
                                <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--error)' }}>
                                    <p style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>BEFORE (Citizen Upload)</p>
                                    <img src={c.image} alt="Before" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                                </div>
                            )}

                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{c.description}</p>

                            {/* Worker Actions */}
                            {c.status !== 'RESOLVED' ? (
                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>

                                    {/* Status Toggle */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Current Status</label>
                                        <select
                                            className="glass-input"
                                            value={c.status}
                                            onChange={(e) => {
                                                if (e.target.value === 'RESOLVED') return; // Enforce visual separation
                                                handleStatusChange(c.id, e.target.value);
                                            }}
                                            style={{ padding: '0.5rem' }}
                                        >
                                            <option value="ASSIGNED">Assigned</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="RESOLVED" disabled>Resolved (Use Upload Below)</option>
                                        </select>
                                    </div>

                                    {/* Resolution Upload */}
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>✅ Complete Job</label>

                                        <input
                                            type="file"
                                            id={`file-${c.id}`}
                                            accept="image/*"
                                            onChange={(e) => handleImageRead(e, c.id)}
                                            style={{ display: 'none' }}
                                        />

                                        <label htmlFor={`file-${c.id}`} style={{
                                            display: 'block',
                                            padding: '0.5rem',
                                            textAlign: 'center',
                                            border: '1px dashed var(--success)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginBottom: '0.5rem',
                                            background: resolutionImage[c.id] ? 'rgba(0,0,0,0.2)' : 'transparent'
                                        }}>
                                            {resolutionImage[c.id] ? "📸 Image Selected" : "📸 Upload 'After' Photo"}
                                        </label>

                                        {resolutionImage[c.id] && (
                                            <button
                                                className="btn-primary"
                                                style={{ width: '100%', background: 'var(--success)' }}
                                                onClick={() => handleResolve(c.id)}
                                            >
                                                Mark as Resolved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                                    <p style={{ color: 'var(--success)', textAlign: 'center', fontWeight: 'bold' }}>Job Completed!</p>
                                    {c.resolutionImage && (
                                        <div style={{ marginTop: '0.5rem', borderRadius: '4px', overflow: 'hidden' }}>
                                            <p style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>AFTER</p>
                                            <img src={c.resolutionImage} alt="After" style={{ width: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkerDashboard;
