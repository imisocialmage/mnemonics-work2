import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Trophy,
    Target,
    Calendar,
    TrendingUp,
    Settings,
    Download,
    Plus,
    X,
    CheckCircle2,
    LayoutDashboard,
    Zap,
    Users,
    FileText,
    Crown,
    Flame,
    Gem,
    Lightbulb
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './EliteChallenges.css';

Chart.register(...registerables);

const GET_LEVEL_CONFIG = (t) => ({
    newbie: { icon: <Lightbulb className="w-8 h-8" />, name: t('elite.levels.newbie.name'), xpNeeded: 100, motto: t('elite.levels.newbie.motto'), next: 'beginner' },
    beginner: { icon: <Flame className="w-8 h-8" />, name: t('elite.levels.beginner.name'), xpNeeded: 300, motto: t('elite.levels.beginner.motto'), next: 'intermediate' },
    intermediate: { icon: <Zap className="w-8 h-8" />, name: t('elite.levels.intermediate.name'), xpNeeded: 600, motto: t('elite.levels.intermediate.motto'), next: 'elite' },
    elite: { icon: <Gem className="w-8 h-8" />, name: t('elite.levels.elite.name'), xpNeeded: 1000, motto: t('elite.levels.elite.motto'), next: 'leader' },
    leader: { icon: <Crown className="w-8 h-8" />, name: t('elite.levels.leader.name'), xpNeeded: 9999, motto: t('elite.levels.leader.motto'), next: null }
});

const XP_VALUES = {
    session: 10,
    training: 15,
    mentor: 25,
    host: 30,
    content: 40,
    recruit: 50,
    event: 75
};

const EliteChallenges = ({ profileIndex }) => {
    const { t } = useTranslation();
    const getProfileKey = useCallback((key) => `imi-p${profileIndex}-${key}`, [profileIndex]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [memberData, setMemberData] = useState(() => {
        const saved = localStorage.getItem(getProfileKey('myProgressData'));
        const eliteData = saved ? JSON.parse(saved) : null;

        // Sync with global profile if available
        const globalProfile = JSON.parse(localStorage.getItem('imi-user-profile') || '{}');
        if (globalProfile.memberName && eliteData) {
            eliteData.memberName = globalProfile.memberName;
            eliteData.email = globalProfile.email;
        }
        return eliteData;
    });

    const [currentTab, setCurrentTab] = useState('overview');
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [editActivityIndex, setEditActivityIndex] = useState(null);

    const [formData, setFormData] = useState({
        memberName: '',
        email: '',
        phone: '',
        primaryGoal: '',
        joinDate: new Date().toISOString().split('T')[0],
        skillLevel: 'newbie',
        currentXP: 0,
        mentor: '',
        profilePicture: ''
    });

    const [activityForm, setActivityForm] = useState({
        type: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const updateGrowthChart = useCallback(() => {
        if (!chartRef.current || !memberData || !memberData.activities) return;

        const ctx = chartRef.current.getContext('2d');
        const sorted = [...memberData.activities].sort((a, b) => new Date(a.date) - new Date(b.date));

        let cumulativeXP = 0;
        const chartData = sorted.map(activity => {
            cumulativeXP += activity.xp;
            return {
                x: new Date(activity.date),
                y: cumulativeXP
            };
        });

        if (chartData.length === 0) {
            chartData.push({ x: new Date(), y: 0 });
        }

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'XP Growth',
                    data: chartData,
                    borderColor: '#2979FF',
                    backgroundColor: 'rgba(41, 121, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#2979FF',
                    pointBorderColor: '#FAFAFA',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#2979FF',
                        bodyColor: '#FAFAFA',
                        borderColor: '#2979FF',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day' },
                        ticks: { color: '#B0B0B0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#B0B0B0',
                            callback: (value) => value + ' XP'
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }, [memberData]);

    // Handle Data Persistence & Profile Sync
    useEffect(() => {
        const saved = localStorage.getItem(getProfileKey('myProgressData'));
        setMemberData(saved ? JSON.parse(saved) : null);
    }, [profileIndex, getProfileKey]);

    useEffect(() => {
        if (memberData) {
            localStorage.setItem(getProfileKey('myProgressData'), JSON.stringify(memberData));

            // Sync to global profile
            const globalProfile = {
                memberName: memberData.memberName,
                email: memberData.email,
                lastUpdate: new Date().getTime()
            };
            localStorage.setItem('imi-user-profile', JSON.stringify(globalProfile));

            updateGrowthChart();
        }
    }, [memberData, getProfileKey, updateGrowthChart]);

    const handleProfileSave = (e) => {
        e.preventDefault();
        const newData = {
            ...(memberData || { activities: [], completedMilestones: [] }),
            ...formData
        };
        setMemberData(newData);
        setShowSetupModal(false);
    };

    const handleActivitySave = (e) => {
        e.preventDefault();
        const xp = XP_VALUES[activityForm.type];
        const newActivity = { ...activityForm, xp };

        const updatedActivities = memberData.activities ? [...memberData.activities] : [];
        let newXP = memberData.currentXP || 0;

        if (editActivityIndex !== null) {
            newXP -= updatedActivities[editActivityIndex].xp;
            updatedActivities[editActivityIndex] = newActivity;
            newXP += xp;
        } else {
            updatedActivities.push(newActivity);
            newXP += xp;
        }

        // Check for level up
        const levelConfig = GET_LEVEL_CONFIG(t);
        let newLevel = memberData.skillLevel;
        const config = levelConfig[newLevel];
        if (config.next && newXP >= config.xpNeeded) {
            newLevel = config.next;
            alert(`🎉 ${t('elite.congratulations', { level: levelConfig[newLevel].name })}`);
        }

        setMemberData({
            ...memberData,
            activities: updatedActivities,
            currentXP: newXP,
            skillLevel: newLevel
        });

        setShowActivityModal(false);
    };

    const deleteActivity = (index) => {
        if (!window.confirm('Are you sure you want to delete this activity?')) return;
        const updatedActivities = [...memberData.activities];
        const removedXP = updatedActivities[index].xp;
        updatedActivities.splice(index, 1);

        setMemberData({
            ...memberData,
            activities: updatedActivities,
            currentXP: (memberData.currentXP || 0) - removedXP
        });
    };

    const toggleMilestone = (index) => {
        const completed = memberData.completedMilestones ? [...memberData.completedMilestones] : [];
        const idx = completed.indexOf(index);
        if (idx > -1) {
            completed.splice(idx, 1);
        } else {
            completed.push(index);
        }
        setMemberData({ ...memberData, completedMilestones: completed });
    };

    const exportProgress = () => {
        const wb = XLSX.utils.book_new();
        const levelConfig = GET_LEVEL_CONFIG(t);
        const level = levelConfig[memberData.skillLevel];

        // Members Sheet
        const mainData = [{
            [t('elite.export_headers.name')]: memberData.memberName,
            [t('elite.export_headers.email')]: memberData.email || '',
            [t('elite.export_headers.level')]: level.name,
            [t('elite.export_headers.xp')]: memberData.currentXP,
            [t('elite.export_headers.join_date')]: memberData.joinDate
        }];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mainData), t('elite.export_headers.sheet_member'));

        // Activities Sheet
        if (memberData.activities?.length > 0) {
            const actData = memberData.activities.map(a => ({
                [t('elite.export_headers.date')]: a.date,
                [t('elite.export_headers.type')]: t(`elite.modals.types.${a.type}`),
                [t('elite.export_headers.xp')]: a.xp,
                [t('elite.export_headers.notes')]: a.notes
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(actData), t('elite.export_headers.sheet_activities'));
        }

        XLSX.writeFile(wb, `${memberData.memberName}_Elite_Progress.xlsx`);
    };

    // clearSoloChat removed as it was unused and referenced non-existent state.

    if (!memberData && !showSetupModal) {
        return (
            <div className="elite-container">
                <div className="welcome-screen">
                    <h1>🧭 {t('elite.welcome_title')}</h1>
                    <p>{t('elite.welcome_desc')}</p>
                    <button className="premium-btn" onClick={() => setShowSetupModal(true)}>
                        {t('elite.get_started')}
                    </button>
                </div>
            </div>
        );
    }

    const levelConfig = GET_LEVEL_CONFIG(t);
    const currentLevelConfig = levelConfig[memberData?.skillLevel || 'newbie'];
    const progressXP = memberData?.currentXP || 0;
    const targetXP = currentLevelConfig.xpNeeded;
    const progressPercent = Math.min(100, (progressXP / targetXP) * 100);

    return (
        <div className="elite-container">
            {/* Header */}
            <header className="elite-header">
                <div className="elite-profile">
                    <div className="elite-pic">
                        {memberData?.profilePicture ? (
                            <img src={memberData.profilePicture} alt="Profile" />
                        ) : (
                            <span>{memberData?.memberName?.[0]?.toUpperCase() || '?'}</span>
                        )}
                    </div>
                    <div className="elite-info">
                        <h1>{memberData?.memberName}</h1>
                        <div className="elite-level-badge">
                            {currentLevelConfig.icon}
                            <span>{currentLevelConfig.name} — {currentLevelConfig.motto}</span>
                        </div>
                    </div>
                </div>
                <div className="elite-actions">
                    <button className="elite-btn btn-settings" onClick={() => {
                        setFormData(memberData);
                        setShowSetupModal(true);
                    }}>
                        <Settings className="w-4 h-4" /> {t('elite.edit_profile')}
                    </button>
                    <button className="elite-btn btn-export" onClick={exportProgress}>
                        <Download className="w-4 h-4" /> {t('elite.export')}
                    </button>
                    <button className="elite-btn btn-add" onClick={() => {
                        setActivityForm({ type: '', date: new Date().toISOString().split('T')[0], notes: '' });
                        setEditActivityIndex(null);
                        setShowActivityModal(true);
                    }}>
                        <Plus className="w-4 h-4" /> {t('elite.add_activity')}
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="elite-tabs-card">
                <div className="elite-tabs-nav">
                    <button className={`tab-nav-item ${currentTab === 'overview' ? 'active' : ''}`} onClick={() => setCurrentTab('overview')}>
                        <LayoutDashboard className="w-4 h-4" /> {t('elite.tabs.overview')}
                    </button>
                    <button className={`tab-nav-item ${currentTab === 'activities' ? 'active' : ''}`} onClick={() => setCurrentTab('activities')}>
                        <Trophy className="w-4 h-4" /> {t('elite.tabs.activities')}
                    </button>
                    <button className={`tab-nav-item ${currentTab === 'milestones' ? 'active' : ''}`} onClick={() => setCurrentTab('milestones')}>
                        <Target className="w-4 h-4" /> {t('elite.tabs.milestones')}
                    </button>
                    <button className={`tab-nav-item ${currentTab === 'growth' ? 'active' : ''}`} onClick={() => {
                        setCurrentTab('growth');
                        setTimeout(updateGrowthChart, 100);
                    }}>
                        <TrendingUp className="w-4 h-4" /> {t('elite.tabs.growth')}
                    </button>
                </div>

                <div className="elite-tab-content">
                    {currentTab === 'overview' && (
                        <div className="overview-pane">
                            <div className="elite-stats-grid">
                                <div className="elite-stat-card">
                                    <div className="stat-val">{progressXP}</div>
                                    <div className="stat-lab">{t('elite.stats.current_xp')}</div>
                                </div>
                                <div className="elite-stat-card">
                                    <div className="stat-val">{targetXP}</div>
                                    <div className="stat-lab">{t('elite.stats.target_xp')}</div>
                                </div>
                                <div className="elite-stat-card">
                                    <div className="stat-val">{memberData?.activities?.length || 0}</div>
                                    <div className="stat-lab">{t('elite.stats.activities')}</div>
                                </div>
                            </div>

                            <div className="elite-xp-section">
                                <h3>{t('elite.level_progression')}</h3>
                                <div className="xp-bar-wrapper">
                                    <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <div className="xp-label">{progressPercent.toFixed(0)}% {t('elite.to_next_level')}</div>
                            </div>
                        </div>
                    )}

                    {currentTab === 'activities' && (
                        <div className="activities-pane">
                            <div className="elite-table-wrapper">
                                <table className="elite-table">
                                    <thead>
                                        <tr>
                                            <th>{t('elite.modals.date_label')}</th>
                                            <th>{t('elite.modals.type_label')}</th>
                                            <th>{t('elite.stats.xp')}</th>
                                            <th>{t('elite.modals.notes_label')}</th>
                                            <th>{t('common.actions') || 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {memberData?.activities?.map((act, idx) => (
                                            <tr key={idx}>
                                                <td>{act.date}</td>
                                                <td>{t(`elite.modals.types.${act.type}`)}</td>
                                                <td className="xp-txt">+{act.xp}</td>
                                                <td>{act.notes}</td>
                                                <td>
                                                    <div className="row-actions">
                                                        <button onClick={() => {
                                                            setActivityForm(act);
                                                            setEditActivityIndex(idx);
                                                            setShowActivityModal(true);
                                                        }} className="row-btn edit">{t('common.edit') || 'Edit'}</button>
                                                        <button onClick={() => deleteActivity(idx)} className="row-btn delete">{t('common.delete') || 'Delete'}</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentTab === 'milestones' && (
                        <div className="milestones-pane">
                            <div className="milestone-list">
                                {(t(`elite.milestones_data.${memberData?.skillLevel || 'newbie'}`, { returnObjects: true }) || []).map((m, idx) => {
                                    const isComplete = memberData?.completedMilestones?.includes(idx);
                                    return (
                                        <div key={idx} className={`milestone-item ${isComplete ? 'complete' : ''}`} onClick={() => toggleMilestone(idx)}>
                                            <CheckCircle2 className={`w-6 h-6 ${isComplete ? 'text-blue-500' : 'text-gray-600'}`} />
                                            <span>{m}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {currentTab === 'growth' && (
                        <div className="growth-pane">
                            <div className="chart-box">
                                <canvas ref={chartRef}></canvas>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Setup Modal */}
            {showSetupModal && (
                <div className="elite-modal-overlay">
                    <div className="elite-modal">
                        <div className="modal-top">
                            <h2>{t('elite.setup_profile')}</h2>
                            <button onClick={() => setShowSetupModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleProfileSave} className="elite-form">
                            <div className="form-row">
                                <label>{t('elite.modals.name_label')}</label>
                                <input required value={formData.memberName} onChange={e => setFormData({ ...formData, memberName: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <label>{t('elite.export_headers.level')}</label>
                                <select value={formData.skillLevel} onChange={e => setFormData({ ...formData, skillLevel: e.target.value })}>
                                    {Object.keys(levelConfig).map(k => <option key={k} value={k}>{levelConfig[k].name}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>{t('elite.modals.notes_label')}</label>
                                <input placeholder="e.g. Launch Agency, Retire in 2 years" value={formData.primaryGoal} onChange={e => setFormData({ ...formData, primaryGoal: e.target.value })} />
                            </div>
                            <button type="submit" className="premium-btn">{t('elite.save_profile')}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Activity Modal */}
            {showActivityModal && (
                <div className="elite-modal-overlay">
                    <div className="elite-modal">
                        <div className="modal-top">
                            <h2>{t('elite.log_activity')}</h2>
                            <button onClick={() => setShowActivityModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleActivitySave} className="elite-form">
                            <div className="form-row">
                                <label>{t('elite.modals.type_label')}</label>
                                <select required value={activityForm.type} onChange={e => setActivityForm({ ...activityForm, type: e.target.value })}>
                                    <option value="">{t('common.select') || 'Select...'}</option>
                                    {Object.keys(XP_VALUES).map(k => <option key={k} value={k}>{t(`elite.modals.types.${k}`)} ({XP_VALUES[k]} XP)</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>{t('elite.modals.date_label')}</label>
                                <input type="date" value={activityForm.date} onChange={e => setActivityForm({ ...activityForm, date: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <label>{t('elite.modals.notes_label')}</label>
                                <textarea value={activityForm.notes} onChange={e => setActivityForm({ ...activityForm, notes: e.target.value })} />
                            </div>
                            <button type="submit" className="premium-btn">{t('elite.save_activity')}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EliteChallenges;
