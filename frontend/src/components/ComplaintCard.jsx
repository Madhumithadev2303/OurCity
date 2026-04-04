import React, { useState } from 'react';

const ComplaintCard = ({ complaint, children }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    
    // Check if complaint has mocked comments, else empty
    const defaultComments = complaint.comments || [
        { user: 'Neighborhood Watch', text: 'Thanks for reporting this! I noticed it yesterday.' },
    ];
    // To make demo interesting, only show mocked comments on a few cards randomly, 
    // but here we just assign generic mock if missing for demo purposes.
    const [localComments, setLocalComments] = useState(complaint.id > 101 ? defaultComments : []);

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header: Status & CreatedAt */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`status-badge status-${complaint.status?.toLowerCase() || 'pending'}`}>
                        {complaint.status || 'PENDING'}
                    </span>
                    {complaint.upvotes > 0 && (
                        <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            👍 {complaint.upvotes}
                        </span>
                    )}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif" }}>
                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Just now'}
                </span>
            </div>

            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.3rem', lineHeight: '1.3' }}>{complaint.title}</h3>

            {/* Assigned Worker Details */}
            {complaint.assignedOfficer && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>👷‍♂️</span>
                    <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', margin: '0 0 0.2rem 0' }}>ASSIGNED WORKER</p>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '600', margin: 0 }}>{complaint.assignedOfficer.fullName || complaint.assignedOfficer.username}</p>
                    </div>
                </div>
            )}

            {/* Before & After Images */}
            {(complaint.image || complaint.resolutionImage) && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    {complaint.image && (
                        <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                            <p style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', padding: '0.4rem', fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', margin: 0 }}>BEFORE COMPLETING WORK</p>
                            <img src={complaint.image} alt="Before" style={{ width: '100%', height: '180px', objectFit: 'cover', flex: 1 }} />
                        </div>
                    )}
                    {complaint.resolutionImage && (
                        <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', flexDirection: 'column' }}>
                            <p style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '0.4rem', fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', margin: 0 }}>AFTER COMPLETING WORK</p>
                            <img src={complaint.resolutionImage} alt="After" style={{ width: '100%', height: '180px', objectFit: 'cover', flex: 1 }} />
                        </div>
                    )}
                </div>
            )}

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flex: 1, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {complaint.description}
            </p>

            {/* Comments Toggle */}
            <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', padding: 0 }}
                >
                    💬 {localComments.length} Community Comments {showComments ? '▼' : '▶'}
                </button>
                
                {showComments && (
                    <div className="animate-fade-in" style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        {localComments.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '1rem 0' }}>No comments yet. Be the first to discuss this issue!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                {localComments.map((cmt, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{cmt.user}</p>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{cmt.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                className="glass-input" 
                                style={{ padding: '0.6rem', fontSize: '0.85rem' }}
                                placeholder="Add a comment..." 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button 
                                className="btn-primary" 
                                style={{ padding: '0.6rem 1rem' }}
                                onClick={() => {
                                    if(commentText.trim()) {
                                        setLocalComments([...localComments, { user: 'You', text: commentText }]);
                                        setCommentText('');
                                    }
                                }}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Role-Based Actions & Info */}
            <div style={{ marginTop: 'auto' }}>
                {children}
            </div>
        </div>
    );
};

export default ComplaintCard;
