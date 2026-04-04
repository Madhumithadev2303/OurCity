import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('kumar');
    const [password, setPassword] = useState('demo');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('citizen');

    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        if (tab === 'citizen') {
            setUsername('kumar');
            setPassword('demo');
        } else if (tab === 'worker') {
            setUsername('ram');
            setPassword('worker');
        } else if (tab === 'supervisor') {
            setUsername('manager');
            setPassword('admin');
        } else {
            setUsername('');
            setPassword('');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (username === 'kumar' && password === 'demo') {
            localStorage.setItem('user', JSON.stringify({ id: 1, username: 'kumar', fullName: 'Kumar', role: 'CITIZEN' }));
            navigate('/dashboard');
            return;
        }
        if (username === 'manager' && password === 'admin') {
            localStorage.setItem('user', JSON.stringify({ id: 99, username: 'manager', fullName: 'Supervisor', role: 'ADMIN' }));
            navigate('/admin');
            return;
        }
        if (username === 'ram' && password === 'worker') {
            localStorage.setItem('user', JSON.stringify({ id: 101, username: 'ram', fullName: 'Ram', role: 'OFFICER' }));
            navigate('/worker');
            return;
        }
        if (username === 'karthi' && password === 'worker') {
            localStorage.setItem('user', JSON.stringify({ id: 102, username: 'karthi', fullName: 'Karthi', role: 'OFFICER' }));
            navigate('/worker');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('user', JSON.stringify(user));
                if (user.role === 'ADMIN') navigate('/admin');
                else if (user.role === 'OFFICER') navigate('/worker');
                else navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Check backend connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="gradient-text" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
                    {activeTab === 'citizen' ? 'Citizen Login' :
                        activeTab === 'worker' ? 'Worker Portal' : 'Supervisor Access'}
                </h2>

                {/* Role Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    {['citizen', 'worker', 'supervisor'].map(role => (
                        <button
                            key={role}
                            onClick={() => handleTabChange(role)}
                            style={{
                                background: activeTab === role ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                color: activeTab === role ? 'white' : 'var(--text-muted)',
                                border: activeTab === role ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                flex: 1,
                                fontWeight: activeTab === role ? '600' : '500',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontSize: '0.9rem'
                            }}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1.5rem', textAlign: 'center', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            className="glass-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            autoComplete="off"
                        />
                    </div>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        {activeTab === 'citizen' && (
                            <p>Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', transition: 'text-shadow 0.2s' }} onMouseOver={e => e.target.style.textShadow = '0 0 10px rgba(139,92,246,0.6)'} onMouseOut={e => e.target.style.textShadow = 'none'}>Sign Up</Link></p>
                        )}
                    </div>
                </form>
            </div>

            <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <span>&larr;</span> Back to Home
            </button>
        </div>
    );
};

export default Login;
