import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header/Nav */}
            <nav style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CrowdComplaint
                </h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem' }}>
                        Sign Up
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', gap: '2rem' }}>
                <div style={{ maxWidth: '800px' }}>
                    <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                        Fix Your City. <br />
                        <span style={{ color: 'var(--primary)' }}>Together.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        Report issues, gather support, and watch your neighborhood improve. The power to change your community is in your hands.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/login')} className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        Start Reporting 🚀
                    </button>
                    <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--glass-border)', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}>
                        Learn More
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '4rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>How It Works</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <FeatureCard
                            icon="📸"
                            title="Snap & Share"
                            desc="Take a photo of a pothole, leak, or garbage pile. Upload it instantly with a description."
                        />
                        <FeatureCard
                            icon="🗺️"
                            title="Live Map"
                            desc="View all reported issues on an interactive city map. See what's happening around you in real-time."
                        />
                        <FeatureCard
                            icon="👍"
                            title="Community Vote"
                            desc="Neighbors verify and upvote issues. High-vote problems get prioritized by the city."
                        />
                        <FeatureCard
                            icon="✅"
                            title="Verified Fixes"
                            desc="Workers fix the issue and upload proof of resolution. Everyone gets notified!"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)' }}>
                <p>&copy; 2026 CrowdComplaint. Built for Better Cities.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{desc}</p>
    </div>
);

export default LandingPage;
