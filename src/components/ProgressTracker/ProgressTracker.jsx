import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';
import {
    Trophy,
    Calendar,
    Plus,
    Settings,
    BarChart3,
    Layout,
    FileText,
    ClipboardList,
    Trash2,
    ExternalLink,
    Save,
    Download,
    RotateCcw,
    X,
    CheckCircle2,
    Copy,
    Sparkles
} from 'lucide-react';
import './ProgressTracker.css';

const PRINCIPLES = [
    { id: 'real_work', nameKey: 'tracker.principles.real_work', icon: '🔨', color: '#2979FF' },
    { id: 'ai_driver', nameKey: 'tracker.principles.ai_driver', icon: '🤖', color: '#00BCD4' },
    { id: 'portfolio', nameKey: 'tracker.principles.portfolio', icon: '📁', color: '#4CAF50' },
    { id: 'soft_skills', nameKey: 'tracker.principles.soft_skills', icon: '💬', color: '#FF9800' },
    { id: 'distribution', nameKey: 'tracker.principles.distribution', icon: '📡', color: '#9C27B0' },
    { id: 'protect_real', nameKey: 'tracker.principles.protect_real', icon: '🛡️', color: '#F44336' },
    { id: 'run_business', nameKey: 'tracker.principles.run_business', icon: '💼', color: '#607D8B' }
];

const PATH_KEYS = {
    college: 'tracker.paths.college',
    trade: 'tracker.paths.trade',
    military: 'tracker.paths.military',
    entrepreneur: 'tracker.paths.entrepreneur',
    unsure: 'tracker.paths.unsure'
};

const ProgressTracker = ({ profileIndex }) => {
    const { t } = useTranslation();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);
    const [profile, setProfile] = useState(null);
    const [activities, setActivities] = useState([]);
    const [portfolioPieces, setPortfolioPieces] = useState([]);
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);

    // Modals state
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Load Profile
            const savedProfile = localStorage.getItem(getProfileKey('entrepreneur_profile'));
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                setProfile(parsed);
                // Sync to global
                localStorage.setItem('imi-user-profile', JSON.stringify({
                    memberName: parsed.name,
                    email: parsed.email,
                    lastUpdate: new Date().getTime()
                }));
            } else {
                setIsProfileModalOpen(true);
            }

            // Load Activities
            const savedActivities = localStorage.getItem(getProfileKey('entrepreneur_activities'));
            if (savedActivities) setActivities(JSON.parse(savedActivities));

            // Load Portfolio
            const savedPortfolio = localStorage.getItem(getProfileKey('entrepreneur_portfolio'));
            if (savedPortfolio) setPortfolioPieces(JSON.parse(savedPortfolio));

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getProfileKey]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const calculateStats = () => {
        const principleProgress = {};
        PRINCIPLES.forEach(p => {
            const relatedActivities = activities.filter(a => a.principle === p.id);
            principleProgress[p.id] = {
                activities: relatedActivities.length,
                totalXP: relatedActivities.reduce((sum, a) => sum + (a.xp || 10), 0)
            };
        });

        const totalXP = activities.reduce((sum, a) => sum + (a.xp || 10), 0);
        const daysActive = new Set(activities.map(a => a.date)).size;

        // Streak calculation
        let weekStreak = 0;
        if (activities.length > 0) {
            const sorted = [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));
            let currentDate = new Date();
            for (let i = 0; i < 52; i++) {
                const weekStart = new Date(currentDate);
                weekStart.setDate(weekStart.getDate() - 7);
                const hasActivity = sorted.some(a => {
                    const actDate = new Date(a.date);
                    return actDate >= weekStart && actDate <= currentDate;
                });
                if (hasActivity) {
                    weekStreak++;
                    currentDate = weekStart;
                } else break;
            }
        }

        return { principleProgress, totalXP, daysActive, weekStreak };
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const profileData = {
            name: formData.get('name'),
            path: formData.get('path'),
            email: formData.get('email'),
            currentFocus: formData.get('currentFocus'),
            goal12Month: formData.get('goal12Month'),
            startDate: profile?.startDate || new Date().toISOString().split('T')[0]
        };

        setProfile(profileData);

        // Sync to global profile
        localStorage.setItem('imi-user-profile', JSON.stringify({
            memberName: profileData.name,
            email: profileData.email,
            lastUpdate: new Date().getTime()
        }));

        localStorage.setItem(getProfileKey('entrepreneur_profile'), JSON.stringify(profileData));
        setIsProfileModalOpen(false);
    };

    const handleSaveActivity = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const activity = {
            id: Date.now(),
            principle: formData.get('principle'),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            xp: parseInt(formData.get('xp')) || 10
        };

        const updatedActivities = [...activities, activity];
        setActivities(updatedActivities);
        localStorage.setItem(getProfileKey('entrepreneur_activities'), JSON.stringify(updatedActivities));
        setIsActivityModalOpen(false);
    };

    const handleSavePortfolio = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const piece = {
            id: Date.now(),
            title: formData.get('title'),
            type: formData.get('type'),
            description: formData.get('description'),
            skills: formData.get('skills'),
            link: formData.get('link'),
            date: new Date().toISOString().split('T')[0]
        };

        const updatedPortfolio = [...portfolioPieces, piece];
        setPortfolioPieces(updatedPortfolio);
        localStorage.setItem(getProfileKey('entrepreneur_portfolio'), JSON.stringify(updatedPortfolio));
        setIsPortfolioModalOpen(false);
    };

    const handleDeleteActivity = async (id) => {
        if (!window.confirm(t('tracker.ui.delete_confirm'))) return;
        const updatedActivities = activities.filter(a => a.id !== id);
        setActivities(updatedActivities);
        localStorage.setItem(getProfileKey('entrepreneur_activities'), JSON.stringify(updatedActivities));
    };

    const handleDeletePortfolio = async (id) => {
        if (!window.confirm(t('tracker.ui.delete_confirm'))) return;
        const updatedPortfolio = portfolioPieces.filter(p => p.id !== id);
        setPortfolioPieces(updatedPortfolio);
        localStorage.setItem(getProfileKey('entrepreneur_portfolio'), JSON.stringify(updatedPortfolio));
    };

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const stats = calculateStats();

        // Members Sheet
        const membersData = [{
            'Name': profile.name,
            'Email': profile.email || '',
            'XP': stats.totalXP,
            'Join Date': profile.startDate,
            'Focus': profile.currentFocus || ''
        }];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(membersData), 'Profile');

        // Activities Sheet
        if (activities.length > 0) {
            const activitiesData = activities.map(a => ({
                'Date': new Date(a.date).toLocaleDateString(),
                'Principle': t(PRINCIPLES.find(p => p.id === a.principle)?.nameKey),
                'XP Earned': a.xp,
                'Notes': a.description || a.title
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activitiesData), 'Activities');
        }

        // Portfolio Sheet
        if (portfolioPieces.length > 0) {
            const portfolioData = portfolioPieces.map(p => ({
                'Title': p.title,
                'Type': p.type.toUpperCase(),
                'Description': p.description,
                'Skills': p.skills
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(portfolioData), 'Portfolio');
        }

        const fileName = `${profile.name.replace(/\s+/g, '_')}_Progress.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const handleReset = async () => {
        if (!window.confirm(t('tracker.ui.delete_confirm_all'))) return;
        localStorage.removeItem(getProfileKey('entrepreneur_profile'));
        localStorage.removeItem(getProfileKey('entrepreneur_activities'));
        localStorage.removeItem(getProfileKey('entrepreneur_portfolio'));
        localStorage.removeItem(getProfileKey('entrepreneurUserId'));
        window.location.reload();
    };

    if (isLoading) return (
        <div className="tracker-loading">
            <RotateCcw className="animate-spin" size={48} />
            <h2>{t('common.loading')}</h2>
        </div>
    );

    const stats = calculateStats();

    return (
        <div className="progress-tracker-container">
            {/* Header */}
            <div className="tracker-header">
                <div className="header-info">
                    <h1>{profile?.name}</h1>
                    <p className="path-text">{t(PATH_KEYS[profile?.path])}</p>
                    <div className="header-stats">
                        <span>{stats.totalXP} {t('tracker.ui.total_xp')}</span>
                        <span className="divider">•</span>
                        <span>{stats.weekStreak} {t('tracker.ui.week_streak')} 🔥</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="tracker-btn primary" onClick={() => setIsActivityModalOpen(true)}>
                        <Plus size={18} /> {t('tracker.ui.log_activity')}
                    </button>
                    <button className="tracker-btn secondary" onClick={() => setIsProfileModalOpen(true)}>
                        <Settings size={18} /> {t('tracker.ui.settings')}
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card xp">
                    <div className="stat-value">{stats.totalXP}</div>
                    <div className="stat-label">{t('tracker.ui.total_xp')}</div>
                </div>
                <div className="stat-card portfolio">
                    <div className="stat-value">{portfolioPieces.length}/10</div>
                    <div className="stat-label">{t('tracker.ui.portfolio_pieces')}</div>
                </div>
                <div className="stat-card activity">
                    <div className="stat-value">{activities.length}</div>
                    <div className="stat-label">{t('tracker.ui.activities_logged')}</div>
                </div>
                <div className="stat-card days">
                    <div className="stat-value">{stats.daysActive}</div>
                    <div className="stat-label">{t('tracker.ui.active_days')}</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tracker-tabs-card">
                <div className="tabs-nav">
                    <button className={currentTab === 'dashboard' ? 'active' : ''} onClick={() => setCurrentTab('dashboard')}>
                        <BarChart3 size={18} /> {t('tracker.ui.dashboard')}
                    </button>
                    <button className={currentTab === 'principles' ? 'active' : ''} onClick={() => setCurrentTab('principles')}>
                        <Trophy size={18} /> {t('tracker.ui.principles')}
                    </button>
                    <button className={currentTab === 'portfolio' ? 'active' : ''} onClick={() => setCurrentTab('portfolio')}>
                        <Layout size={18} /> {t('tracker.ui.portfolio')}
                    </button>
                    <button className={currentTab === 'activities' ? 'active' : ''} onClick={() => setCurrentTab('activities')}>
                        <ClipboardList size={18} /> {t('tracker.ui.activities')}
                    </button>
                </div>

                <div className="tab-viewport">
                    {currentTab === 'dashboard' && (
                        <div className="tab-dashboard">
                            <div className="goal-box">
                                <h3>{t('tracker.ui.goal_12_month')}</h3>
                                <p>{profile?.goal12Month || t('tracker.ui.no_goal_set')}</p>
                            </div>

                            <div className="principles-mini-grid">
                                {PRINCIPLES.map(p => {
                                    const pStats = stats.principleProgress[p.id];
                                    const progress = Math.min(100, (pStats.totalXP / 100) * 100);
                                    return (
                                        <div key={p.id} className="principle-mini-card">
                                            <div className="mini-card-header">
                                                <span className="icon">{p.icon}</span>
                                                <div>
                                                    <h4>{t(p.nameKey)}</h4>
                                                    <span>{pStats.totalXP} XP</span>
                                                </div>
                                            </div>
                                            <div className="mini-progress">
                                                <div className="fill" style={{ width: `${progress}%`, backgroundColor: p.color }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {currentTab === 'principles' && (
                        <div className="tab-principles">
                            {PRINCIPLES.map(p => {
                                const pActivities = activities.filter(a => a.principle === p.id);
                                return (
                                    <div key={p.id} className="principle-major-card" style={{ borderLeft: `4px solid ${p.color}` }}>
                                        <div className="major-header">
                                            <span className="icon-large">{p.icon}</span>
                                            <h3>{t(p.nameKey)}</h3>
                                            <div className="xp-badge">{stats.principleProgress[p.id].totalXP} XP</div>
                                        </div>
                                        <div className="recent-list">
                                            <h4 className="text-xs uppercase text-gray-500 mb-2">{t('tracker.ui.recent_activities')}</h4>
                                            {pActivities.slice(0, 3).map(a => (
                                                <div key={a.id} className="mini-activity-row">
                                                    <span className="title">{a.title}</span>
                                                    <span className="xp">+{a.xp}</span>
                                                </div>
                                            ))}
                                            {pActivities.length === 0 && <p className="empty">{t('tracker.ui.no_activities_yet')}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {currentTab === 'portfolio' && (
                        <div className="tab-portfolio">
                            <div className="portfolio-header-row">
                                <h3>{t('tracker.ui.portfolio_highlights')} ({portfolioPieces.length}/10)</h3>
                                <button className="tracker-btn success" onClick={() => setIsPortfolioModalOpen(true)}>
                                    <Plus size={16} /> {t('tracker.ui.add_piece')}
                                </button>
                            </div>
                            <div className="portfolio-grid">
                                {portfolioPieces.map(piece => (
                                    <div key={piece.id} className="portfolio-card">
                                        <div className="card-top">
                                            <h4>{piece.title}</h4>
                                            <button className="del-btn" onClick={() => handleDeletePortfolio(piece.id)}><Trash2 size={16} /></button>
                                        </div>
                                        <div className="type-tag">{piece.type}</div>
                                        <p>{piece.description}</p>
                                        <div className="skills">{piece.skills}</div>
                                        {piece.link && <a href={piece.link} target="_blank" className="link"><ExternalLink size={14} /> {t('tracker.ui.view_project')}</a>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentTab === 'activities' && (
                        <div className="tab-activities">
                            <div className="activities-header-row">
                                <h3>{t('tracker.ui.full_activity_log')}</h3>
                                <button className="tracker-btn primary" onClick={() => setIsActivityModalOpen(true)}>
                                    <Plus size={16} /> {t('tracker.ui.log_activity')}
                                </button>
                            </div>
                            <div className="activity-stack">
                                {activities.map(a => {
                                    const p = PRINCIPLES.find(pr => pr.id === a.principle);
                                    return (
                                        <div key={a.id} className="activity-row">
                                            <span className="icon">{p?.icon}</span>
                                            <div className="content">
                                                <h4>{a.title}</h4>
                                                <p>{a.description}</p>
                                                <div className="meta">
                                                    <span>{t(p?.nameKey)}</span>
                                                    <span>•</span>
                                                    <span>{new Date(a.date).toLocaleDateString()}</span>
                                                    <span className="xp">+{a.xp} XP</span>
                                                </div>
                                            </div>
                                            <button className="del-btn" onClick={() => handleDeleteActivity(a.id)}><Trash2 size={16} /></button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Controls */}
            <div className="tracker-footer">
                <button className="footer-btn secondary" onClick={handleExport}><Download size={18} /> {t('tracker.ui.export_data')}</button>
                <button className="footer-btn danger" onClick={handleReset}><RotateCcw size={18} /> {t('tracker.ui.reset_data')}</button>
            </div>

            {/* Modals */}
            {isProfileModalOpen && (
                <div className="tracker-modal-overlay">
                    <div className="tracker-modal">
                        <div className="modal-header">
                            <h2>{profile ? t('tracker.ui.edit_profile') : t('tracker.ui.set_up_profile')}</h2>
                            {profile && <button onClick={() => setIsProfileModalOpen(false)} className="close"><X /></button>}
                        </div>
                        <form onSubmit={handleSaveProfile}>
                            <div className="f-group">
                                <label>{t('tracker.ui.full_name')}</label>
                                <input name="name" defaultValue={profile?.name} required placeholder={t('tracker.ui.your_name_placeholder')} />
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.current_path')}</label>
                                <select name="path" defaultValue={profile?.path || 'unsure'}>
                                    {Object.entries(PATH_KEYS).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
                                </select>
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.focus_interest')}</label>
                                <input name="currentFocus" defaultValue={profile?.currentFocus} placeholder={t('tracker.ui.focus_placeholder')} />
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.goal_12_month')}</label>
                                <textarea name="goal12Month" defaultValue={profile?.goal12Month} rows="3" placeholder={t('tracker.ui.goal_placeholder')} />
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="save-btn"><CheckCircle2 size={18} /> {t('tracker.ui.save_profile')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isActivityModalOpen && (
                <div className="tracker-modal-overlay" onClick={() => setIsActivityModalOpen(false)}>
                    <div className="tracker-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{t('tracker.ui.log_activity')}</h2>
                            <button onClick={() => setIsActivityModalOpen(false)} className="close"><X /></button>
                        </div>
                        <form onSubmit={handleSaveActivity}>
                            <div className="f-group">
                                <label>{t('tracker.ui.principle')}</label>
                                <select name="principle" required>
                                    {PRINCIPLES.map(p => <option key={p.id} value={p.id}>{p.icon} {t(p.nameKey)}</option>)}
                                </select>
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.activity_title')}</label>
                                <input name="title" required placeholder={t('tracker.ui.activity_title_placeholder')} />
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.description')}</label>
                                <textarea name="description" rows="2" placeholder={t('tracker.ui.description_placeholder')} />
                            </div>
                            <div className="f-row">
                                <div className="f-group">
                                    <label>{t('tracker.ui.date')}</label>
                                    <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="f-group">
                                    <label>{t('tracker.ui.xp_value')}</label>
                                    <input type="number" name="xp" defaultValue="10" step="5" min="5" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="save-btn">{t('tracker.ui.log_activity')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPortfolioModalOpen && (
                <div className="tracker-modal-overlay" onClick={() => setIsPortfolioModalOpen(false)}>
                    <div className="tracker-modal portfolio-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ color: '#10B981' }}>{t('tracker.ui.add_portfolio_piece')}</h2>
                            <button onClick={() => setIsPortfolioModalOpen(false)} className="close"><X /></button>
                        </div>
                        <form onSubmit={handleSavePortfolio}>
                            <div className="f-group">
                                <label>{t('tracker.ui.project_title')}</label>
                                <input name="title" required placeholder={t('tracker.ui.project_title_placeholder')} />
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.type')}</label>
                                <select name="type">
                                    <option value="case_study">{t('tracker.ui.type_case_study')}</option>
                                    <option value="automation">{t('tracker.ui.type_automation')}</option>
                                    <option value="app">{t('tracker.ui.type_app')}</option>
                                    <option value="repair">{t('tracker.ui.type_repair')}</option>
                                </select>
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.full_description')}</label>
                                <textarea name="description" rows="4" required placeholder={t('tracker.ui.full_description_placeholder')} />
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.skills_tools')}</label>
                                <input name="skills" placeholder={t('tracker.ui.skills_placeholder')} />
                            </div>
                            <div className="f-group">
                                <label>{t('tracker.ui.project_link')}</label>
                                <input type="url" name="link" placeholder="https://..." />
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="save-btn success">{t('tracker.ui.add_piece')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressTracker;
