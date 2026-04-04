import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            {/* Nav */}
            <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                <h2 className="gradient-text" style={{ fontSize: '1.8rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    CrowdComplaint
                </h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.target.style.color = 'var(--primary)'}
                        onMouseOut={(e) => e.target.style.color = 'var(--text-main)'}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="btn-primary"
                        style={{ padding: '0.6rem 1.5rem' }}>
                        Sign Up Free
                    </button>
                </div>
            </nav>

            {/* Glowing Orb Decor */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.3, zIndex: 0, borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '500px', height: '500px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.2, zIndex: 0, borderRadius: '50%' }}></div>

            {/* Hero Section */}
            <header className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '900px' }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                        🌟 THE FUTURE OF SMART CITIES
                    </div>
                    <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: '1.05', marginBottom: '2rem' }}>
                        Build a Better City. <br />
                        <span className="gradient-text">Together.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto 3rem auto', fontFamily: "'Inter', sans-serif" }}>
                        Empower your community. Report infrastructure issues, crowdsource support, and track real-time resolutions from city officials in one unified platform.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/login')} className="btn-primary" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem', borderRadius: '16px' }}>
                        Start Reporting Now 🚀
                    </button>
                    <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="btn-secondary" style={{ padding: '1.2rem 2.5rem', borderRadius: '16px' }}>
                        See How It Works
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '6rem 2rem', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How CrowdComplaint Works</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>A seamless pipeline from citizen reporting to official resolution.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        <FeatureCard
                            icon="📸"
                            title="Snap & Share"
                            desc="Capture a photo of a pothole, leak, or hazard. Instantly log it on our platform with exact GPS coordinates."
                            delay="0s"
                        />
                        <FeatureCard
                            icon="🗺️"
                            title="Live Map Grid"
                            desc="View every reported issue through our interactive city map. Visualize exactly what's happening around you."
                            delay="0.1s"
                        />
                        <FeatureCard
                            icon="🔥"
                            title="Community Upvote"
                            desc="Neighbors can verify and upvote issues. High-priority problems surface instantly for city supervisors."
                            delay="0.2s"
                        />
                        <FeatureCard
                            icon="✨"
                            title="Verified Fixes"
                            desc="Workers document the fix and upload 'After' photos as proof of resolution. Transparency guaranteed."
                            delay="0.3s"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', position: 'relative', zIndex: 10 }}>
                <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>CrowdComplaint</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>&copy; 2026 Crafted for Better Cities. Developed with the AntiGravity Agent.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', animation: `fadeIn 0.6s ease ${delay} both` }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>{desc}</p>
    </div>
);

export default LandingPage;
