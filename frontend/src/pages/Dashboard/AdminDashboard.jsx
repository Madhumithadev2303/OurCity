import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [officers, setOfficers] = useState([]);

    useEffect(() => {
        if (!user.username || user.role !== 'ADMIN') {
            navigate('/login');
            return;
        }
        fetchComplaints();
        fetchOfficers();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await fetch('/api/complaints');
            if (res.ok) {
                setComplaints(await res.json());
            }
        } catch (err) { console.error(err); }
    };

    const fetchOfficers = async () => {
        try {
            const res = await fetch('/api/users?role=OFFICER');
            if (res.ok) {
                setOfficers(await res.json());
            }
        } catch (err) { console.error(err); }
    };

    const handleAssign = async (complaintId, officerId) => {
        if (!officerId) return;
        try {
            const res = await fetch(`/api/complaints/${complaintId}/assign?officerId=${officerId}`, { method: 'PUT' });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
            }
        } catch (err) { console.error(err); }
    };

    const chartData = React.useMemo(() => {
        const map = {};
        complaints.forEach(c => {
            const cat = c.category || 'General';
            map[cat] = (map[cat] || 0) + 1;
        });
        return Object.keys(map).map(k => ({ name: k, count: map[k] }));
    }, [complaints]);

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                {/* ... header content ... */}
            </header>

            {/* Overview & Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Stats */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Overview</h3>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem' }}>{complaints.length}</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Issues</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--warning)', fontSize: '2.5rem' }}>{complaints.filter(c => c.status === 'PENDING').length}</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pending</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--success)', fontSize: '2.5rem' }}>{complaints.filter(c => c.status === 'RESOLVED').length}</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Resolved</span>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="glass-panel" style={{ padding: '1.5rem', height: '300px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Complaints by Category</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--dark-card)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4rem' }}>No data available</p>
                    )}
                </div>
            </div>

            <div className="complaint-grid">
                {/* ... (rest of list) ... */}

                {complaints.map(c => (
                    <div key={c.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className={`status-badge status-${c.status?.toLowerCase() || 'pending'}`}>
                                    {c.status || 'PENDING'}
                                </span>
                                {c.upvotes > 0 && (
                                    <span style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-main)',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        👍 {c.upvotes}
                                    </span>
                                )}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'}
                            </span>
                        </div>
                        <h4 style={{ marginBottom: '0.5rem' }}>{c.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{c.description}</p>

                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Assign Officer</label>
                            <select
                                className="glass-input"
                                style={{ padding: '0.5rem' }}
                                value={c.assignedOfficer?.id || ''}
                                onChange={(e) => handleAssign(c.id, e.target.value)}
                            >
                                <option value="">Select Officer...</option>
                                {officers.map(o => (
                                    <option key={o.id} value={o.id}>{o.fullName} ({o.username})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
