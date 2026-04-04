import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import ComplaintCard from '../../components/ComplaintCard';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [officers, setOfficers] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

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
                return;
            }
        } catch (err) { console.error(err); }

        const localData = JSON.parse(localStorage.getItem('mockComplaints_v11') || '[]');
        setComplaints(localData);
    };

    const fetchOfficers = async () => {
        try {
            const res = await fetch('/api/users?role=OFFICER');
            if (res.ok) {
                setOfficers(await res.json());
                return;
            }
        } catch (err) { console.error(err); }

        setOfficers([
            { id: 2, username: 'worker1', fullName: 'Bob Worker', role: 'OFFICER' },
            { id: 3, username: 'worker2', fullName: 'Alice Tech', role: 'OFFICER' },
            { id: 4, username: 'worker3', fullName: 'Rajesh Kumar', role: 'OFFICER' },
            { id: 5, username: 'worker4', fullName: 'Priya Sharma', role: 'OFFICER' }
        ]);
    };

    const handleAssign = async (complaintId, officerId) => {
        if (!officerId) return;
        try {
            const res = await fetch(`/api/complaints/${complaintId}/assign?officerId=${officerId}`, { method: 'PUT' });
            if (res.ok) {
                const updated = await res.json();
                setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
                return;
            }
        } catch (err) { console.error(err); }

        const localData = JSON.parse(localStorage.getItem('mockComplaints_v11') || '[]');
        const officer = officers.find(o => o.id === parseInt(officerId));

        const updatedData = localData.map(c => c.id === complaintId ? { ...c, status: c.status === 'PENDING' ? 'ASSIGNED' : c.status, assignedOfficer: officer } : c);
        localStorage.setItem('mockComplaints_v11', JSON.stringify(updatedData));
        setComplaints(updatedData);
    };

    const chartData = React.useMemo(() => {
        const map = {};
        complaints.forEach(c => {
            const cat = c.category || 'General';
            map[cat] = (map[cat] || 0) + 1;
        });
        return Object.keys(map).map(k => ({ name: k, count: map[k] }));
    }, [complaints]);

    const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header animate-fade-in">
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>City Command Center</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Logged in as <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Admin Supervisor</span></p>
                </div>
                <button className="btn-secondary" onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                }}>End Session</button>
            </header>

            {/* Overview & Analytics */}
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem', animationDelay: '0.1s' }}>
                {/* Stats */}
                <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Live City Metrics</h3>
                    <div className="stats-grid" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <h2 style={{ color: 'var(--text-main)', fontSize: '3rem', lineHeight: '1' }}>{complaints.length}</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total</span>
                        </div>
                        <div style={{ textAlign: 'center', flex: 1, padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <h2 style={{ color: 'var(--warning)', fontSize: '3rem', lineHeight: '1' }}>{complaints.filter(c => c.status === 'PENDING').length}</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--warning)', fontWeight: '500' }}>Pending</span>
                        </div>
                        <div style={{ textAlign: 'center', flex: 1, padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <h2 style={{ color: 'var(--success)', fontSize: '3rem', lineHeight: '1' }}>{complaints.filter(c => c.status === 'RESOLVED').length}</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: '500' }}>Fixed</span>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="glass-panel" style={{ padding: '2.5rem', height: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Incidents by Sector</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: '0.85rem' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: '0.85rem' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--dark-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Awaiting incident reports...</p>
                        </div>
                    )}
                </div>
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Action Required</h2>

            <div className="complaint-grid" style={{ marginBottom: '4rem' }}>
                {complaints.length === 0 ? (
                    <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        No ongoing city issues detected. Incredible!
                    </div>
                ) : (
                    complaints.map((c, idx) => (
                        <div key={c.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}>
                            <ComplaintCard complaint={c}>
                                {/* Admin Action: Assign Officer */}
                                <div style={{ paddingTop: '1.5rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                        👨‍🔧 Dispatch City Worker
                                    </label>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <select
                                            className="glass-input"
                                            style={{ padding: '0.8rem', flex: 1, border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(0,0,0,0.4)' }}
                                            value={c.assignedOfficer?.id || ''}
                                            onChange={(e) => handleAssign(c.id, e.target.value)}
                                        >
                                            <option value="">-- Select Worker --</option>
                                            {officers.map(o => (
                                                <option key={o.id} value={o.id}>{o.fullName} (ID: {o.id})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {c.assignedOfficer && (
                                        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '600', marginBottom: '0.25rem' }}>Currently Dispatched</p>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{c.assignedOfficer.fullName}</p>
                                        </div>
                                    )}
                                </div>
                            </ComplaintCard>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default AdminDashboard;
