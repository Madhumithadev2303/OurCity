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

        // 🚀 DEMO BYPASS: Check for demo accounts locally first so they always work
        // regardless of backend DB state.
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
                if (user.role === 'ADMIN') navigate('/admin'); // Supervisor
                else if (user.role === 'OFFICER') navigate('/worker'); // Worker
                else navigate('/dashboard'); // Citizen
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
            <div className="glass-panel auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>
                    {activeTab === 'citizen' ? 'Citizen Login' :
                        activeTab === 'worker' ? 'Worker Portal' : 'Supervisor Access'}
                </h2>

                {/* Role Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '8px' }}>
                    {['citizen', 'worker', 'supervisor'].map(role => (
                        <button
                            key={role}
                            onClick={() => handleTabChange(role)}
                            style={{
                                background: activeTab === role ? 'var(--primary)' : 'transparent',
                                color: activeTab === role ? 'white' : 'var(--text-muted)',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                flex: 1,
                                fontWeight: activeTab === role ? '600' : 'normal',
                                transition: 'all 0.2s'
                            }}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Username</label>
                        <input
                            type="text"
                            className="glass-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {activeTab === 'citizen' && (
                            <p>Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign Up</Link></p>
                        )}
                        {/* Clean space below if needed */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
