import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OBJECTIVES, STRATEGIC_ADVICE, COMPASS_NODES, getHighlightedPositions, getLocalizedStrategicAdvice } from './data/compassData';
import CompassWheel from './components/Compass/CompassWheel';
import MarketingForm from './components/Form/MarketingForm';
import ReportGenerator from './components/Report/ReportGenerator';
import BrandEvaluator from './components/BrandEvaluator/BrandEvaluator';
import ProductProfiler from './components/ProductProfiler/ProductProfiler';
import ProspectProfiler from './components/ProspectProfiler/ProspectProfiler';
import ConversationGuide from './components/ConversationGuide/ConversationGuide';

import StrategicAdvisor from './components/StrategicAdvisor/StrategicAdvisor';
import AssetAI from './components/AssetAI/AssetAI';
import EliteChallenges from './components/EliteChallenges/EliteChallenges';
import SoloCorp101 from './components/SoloCorp101/SoloCorp101';
import ProgressTracker from './components/ProgressTracker/ProgressTracker';
import CoreProfiler from './components/CoreProfiler/CoreProfiler'; // Added CoreProfiler import
import AuthModal from './components/Auth/AuthModal'; // Added AuthModal import
import UnlockGuideModal from './components/shared/UnlockGuideModal'; // Added UnlockGuideModal import

import NodeAdviceModal from './components/Compass/NodeAdviceModal';
import { Compass, Award, Package, Users, MessageCircle, Sparkles, Lock, ClipboardList, Crown, X, Flame, Download, Upload, HelpCircle, CheckCircle, Layout, Target, Trash2 } from 'lucide-react';
import { generateMasterReport } from './components/Report/MasterReportGenerator';
import { CENTER_ADVICE } from './data/centerAdviceData'; // Import Center Advice Data
import CenterAdviceModal from './components/Compass/CenterAdviceModal'; // Import Center Advice Modal
import { AuthProvider } from './components/Auth/AuthProvider'; // Import Auth Provider
import './index.css';

const ProfileSwitcher = ({ currentIndex, onSwitch, t, onExport, onImport, onShowInfo, onResetProfile, onResetAll }) => {
  return (
    <div className="profile-switcher-container">
      <div className="profile-switcher">
        <div className="profile-options">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              className={`profile-btn ${currentIndex === i ? 'active' : ''}`}
              onClick={() => onSwitch(i)}
              title={t(`profiles.p${i + 1}`)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <span className="profile-label">{t(`profiles.p${currentIndex + 1}`)}</span>
      </div>
      <div className="data-actions">
        <button className="data-btn" onClick={onExport} title={t('profiles.backup')}>
          <Download size={16} />
        </button>
        <label className="data-btn cursor-pointer" title={t('profiles.restore')}>
          <Upload size={16} />
          <input type="file" className="hidden" onChange={onImport} accept=".json" />
        </label>
        <button className="data-btn info-btn" onClick={onShowInfo} title={t('profiles.backup_info.title')}>
          <HelpCircle size={16} />
        </button>
        <button className="data-btn reset-btn" onClick={onResetProfile} title="Reset This Profile">
          <Trash2 size={16} color="#f87171" />
        </button>
        <button className="data-btn reset-all-btn" onClick={onResetAll} title="MASTER RESET (ALL TOOLS)">
          <Trash2 size={16} color="#ef4444" />
        </button>
      </div>
    </div>
  );
};

function App() {
  const { t, i18n } = useTranslation();
  // View state: 'compass' | 'brand-evaluator' | 'product-profiler' | 'prospect-profiler' | 'conversation-guide'
  const [currentView, setCurrentView] = useState('compass');

  // Profile selection state
  const [currentProfileIndex, setCurrentProfileIndex] = useState(() => {
    const saved = localStorage.getItem('imi-active-profile');
    return saved ? parseInt(saved) : 0;
  });

  const getProfileKey = useCallback((key) => `imi-p${currentProfileIndex}-${key}`, [currentProfileIndex]);

  const [formData, setFormData] = useState(() => {
    // Migration: if profile 0 is empty but legacy key exists
    const legacyKey = 'imi-compass-data';
    const profileKey = `imi-p0-${legacyKey}`;
    if (!localStorage.getItem('imi-active-profile') && !localStorage.getItem(profileKey) && localStorage.getItem(legacyKey)) {
      localStorage.setItem(profileKey, localStorage.getItem(legacyKey));
    }

    const saved = localStorage.getItem(getProfileKey('imi-compass-data'));
    return saved ? JSON.parse(saved) : {
      objective: '',
      focus: 'who',
      brandName: '',
      audience: '',
      challenge: ''
    };
  });

  // Save compass data and profile index
  useEffect(() => {
    localStorage.setItem('imi-active-profile', currentProfileIndex);
  }, [currentProfileIndex]);

  // Independent state for the visual compass rotation
  const [compassApex, setCompassApex] = useState(null);

  // State to control report visibility
  const [showReport, setShowReport] = useState(false);

  // Track tool completions for master report
  const [toolCompletions, setToolCompletions] = useState(() => {
    // Migration
    const legacyKey = 'imi-tool-completions';
    const profileKey = `imi-p0-${legacyKey}`;
    if (!localStorage.getItem('imi-active-profile') && !localStorage.getItem(profileKey) && localStorage.getItem(legacyKey)) {
      localStorage.setItem(profileKey, localStorage.getItem(legacyKey));
    }

    const saved = localStorage.getItem(getProfileKey('imi-tool-completions'));
    return saved ? JSON.parse(saved) : {
      compass: false,
      brandEvaluator: false,
      productProfiler: false,
      prospectProfiler: false,
      conversationGuide: false,
      compassProfiler: false
    };
  });

  // Save completions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(getProfileKey('imi-tool-completions'), JSON.stringify(toolCompletions));
  }, [toolCompletions, getProfileKey]);

  // Modal State for Strategic Advice
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [selectedNodeNames, setSelectedNodeNames] = useState([]);

  // Modal State for Center Advice (Who, Brand, Product, Service)
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [currentCenterAdvice, setCurrentCenterAdvice] = useState(null);

  // Tracker Unlock state
  const [isTrackerUnlocked, setIsTrackerUnlocked] = useState(() => {
    const legacyKey = 'imi-tracker-unlocked';
    const profileKey = `imi-p0-${legacyKey}`;
    if (!localStorage.getItem('imi-active-profile') && !localStorage.getItem(profileKey) && localStorage.getItem(legacyKey)) {
      localStorage.setItem(profileKey, localStorage.getItem(legacyKey));
    }
    return localStorage.getItem(getProfileKey('imi-tracker-unlocked')) === 'true';
  });
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [unlockError, setUnlockError] = useState(false);
  const [isEliteUnlocked, setIsEliteUnlocked] = useState(() => {
    const legacyKey = 'imi-elite-unlocked';
    const profileKey = `imi-p0-${legacyKey}`;
    if (!localStorage.getItem('imi-active-profile') && !localStorage.getItem(profileKey) && localStorage.getItem(legacyKey)) {
      localStorage.setItem(profileKey, localStorage.getItem(legacyKey));
    }
    return localStorage.getItem(getProfileKey('imi-elite-unlocked')) === 'true';
  });

  // Effect to reload all data when profile changes
  useEffect(() => {
    const savedCompass = localStorage.getItem(getProfileKey('imi-compass-data'));
    if (savedCompass) {
      setFormData(JSON.parse(savedCompass));
    } else {
      setFormData({ objective: '', focus: 'who', brandName: '', audience: '', challenge: '' });
    }

    const savedCompletions = localStorage.getItem(getProfileKey('imi-tool-completions'));
    if (savedCompletions) {
      setToolCompletions(JSON.parse(savedCompletions));
    } else {
      setToolCompletions({
        compass: false,
        brandEvaluator: false,
        productProfiler: false,
        prospectProfiler: false,
        conversationGuide: false,
        compassProfiler: false
      });
    }

    const savedTracker = localStorage.getItem(getProfileKey('imi-tracker-unlocked')) === 'true';
    setIsTrackerUnlocked(savedTracker);

    const savedElite = localStorage.getItem(getProfileKey('imi-elite-unlocked')) === 'true';
    setIsEliteUnlocked(savedElite);
  }, [currentProfileIndex, getProfileKey]);

  useEffect(() => {
    if (formData) {
      localStorage.setItem(getProfileKey('imi-compass-data'), JSON.stringify({
        objective: formData.objective || '',
        brandName: formData.brandName || '',
        audience: formData.audience || '',
        challenge: formData.challenge || '',
        focus: formData.focus || 'who'
      }));
    }
  }, [formData, getProfileKey]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberCode, setMemberCode] = useState('');
  const [memberError, setMemberError] = useState(false);
  const [showBackupInfoModal, setShowBackupInfoModal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUnlockGuide, setShowUnlockGuide] = useState(false); // Added state for UnlockGuideModal

  // Check if all tools are completed (Foundation + 3 Profilers + Guide)
  const allToolsCompleted = (toolCompletions.compass || toolCompletions.compassProfiler) &&
    toolCompletions.brandEvaluator &&
    toolCompletions.productProfiler &&
    toolCompletions.prospectProfiler &&
    toolCompletions.conversationGuide;

  // Listen for tool completion events
  useEffect(() => {
    const handleToolComplete = (event) => {
      const toolName = event.detail;
      setToolCompletions(prev => ({ ...prev, [toolName]: true }));
    };

    window.addEventListener('tool-completed', handleToolComplete);
    return () => window.removeEventListener('tool-completed', handleToolComplete);
  }, []);

  // Listen for cross-tool navigation events and auth modal events
  useEffect(() => {
    const handleNavigate = (event) => {
      const targetTool = event.detail;
      if (targetTool === 'pitch-master' && !allToolsCompleted) {
        setShowUnlockGuide(true);
        return;
      }
      setCurrentView(targetTool);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleShowAuth = () => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('navigate-to-tool', handleNavigate);
    window.addEventListener('show-auth-modal', handleShowAuth); // Added event listener for AuthModal
    return () => {
      window.removeEventListener('navigate-to-tool', handleNavigate);
      window.removeEventListener('show-auth-modal', handleShowAuth); // Clean up AuthModal listener
    };
  }, []);

  // Listen for master report download event
  useEffect(() => {
    const handleDownloadMaster = () => {
      try {
        generateMasterReport(currentProfileIndex);
      } catch (error) {
        console.error("Master Report Error:", error);
        alert("There was an error generating the master report. Please ensure you have completed some tools first.");
      }
    };

    window.addEventListener('download-master-report', handleDownloadMaster);
    return () => window.removeEventListener('download-master-report', handleDownloadMaster);
  }, []);

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    if (unlockCode === 'Im12620') {
      setIsTrackerUnlocked(true);
      localStorage.setItem(getProfileKey('imi-tracker-unlocked'), 'true');
      setShowUnlockModal(false);
      setCurrentView('progress-tracker');
      setUnlockError(false);
    } else {
      setUnlockError(true);
    }
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    if (memberCode === 'EliteCORE') {
      setIsEliteUnlocked(true);
      localStorage.setItem(getProfileKey('imi-elite-unlocked'), 'true');
      setShowMemberModal(false);
      setCurrentView('elite-challenges');
      setMemberError(false);
    } else {
      setMemberError(true);
    }
  };

  const selectedObjective = formData.objective ? OBJECTIVES[formData.objective] : null;

  // Sync compass apex if objective changes from the form (e.g. dropdown)
  // This ensures if user picks "Acquisition" in dropdown, compass rotates.
  /* 
     We need an effect here or update setFormData to also setCompassApex. 
     Better to do it in handlers to avoid effect loops.
     But handleObjectiveChange isn't fully implemented yet. 
  */

  const handleObjectiveChange = (newObjectiveId) => {
    if (OBJECTIVES[newObjectiveId]) {
      setCompassApex(OBJECTIVES[newObjectiveId].targetPosition);
    }
  };

  const handleExportAll = () => {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('imi-') || key === 'myProgressData') {
        backup[key] = localStorage.getItem(key);
      }
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `imi-compass-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportAll = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Object.keys(data).length === 0) throw new Error("Empty backup");

        if (window.confirm(t('profiles.restore_confirm'))) {
          Object.keys(data).forEach(key => {
            if (key.startsWith('imi-') || key === 'myProgressData') {
              localStorage.setItem(key, data[key]);
            }
          });
          alert(t('profiles.restore_success'));
          window.location.reload();
        }
      } catch {
        alert(t('profiles.restore_error'));
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateReport = () => {
    if (formData.objective) {
      setShowReport(true);
      // Mark compass tool as completed
      window.dispatchEvent(new CustomEvent('tool-completed', { detail: 'compass' }));
      // Small timeout to allow render, then scroll
      setTimeout(() => {
        const reportElement = document.getElementById('report-section');
        if (reportElement) {
          reportElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      alert("Please select a valid objective first.");
    }
  };

  const handleResetProfile = () => {
    if (window.confirm(`Are you sure you want to reset Profile ${currentProfileIndex + 1}? This will clear all analysis data specifically for this profile.`)) {
      const keys = [];
      const prefix = `imi-p${currentProfileIndex}-`;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const handleResetAll = () => {
    if (window.confirm('⚠️ MASTER RESET: This will clear ALL data for ALL 4 profiles and reset the entire application. This action cannot be undone. Proceed?')) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('imi-') || key === 'myProgressData') {
          keys.push(key);
        }
      }
      keys.forEach(k => localStorage.removeItem(k));
      alert('Application has been successfully reset.');
      window.location.reload();
    }
  };

  // Handle closing Node Modal and potentially opening Center Modal
  const handleNodeModalClose = () => {
    setIsModalOpen(false);

    // Trigger the center modal sequentially
    const focusKey = (formData.focus || 'who').toLowerCase();
    if (CENTER_ADVICE[focusKey]) {
      setCurrentCenterAdvice(CENTER_ADVICE[focusKey]);
      // Small timeout to allow the first modal to close smoothly before opening the next
      setTimeout(() => {
        setShowCenterModal(true);
      }, 300);
    }
  };

  // Handle direct click on Center
  const handleCenterClick = () => {
    const focusKey = (formData.focus || 'who').toLowerCase();
    if (CENTER_ADVICE[focusKey]) {
      setCurrentCenterAdvice(CENTER_ADVICE[focusKey]);
      setShowCenterModal(true);
    }
  };

  const handleNodeClick = (node) => {
    // 1. Always rotate the visual compass
    setCompassApex(node.position);

    // 2. Map position to objective (Original logic: 8->Acq, 1->Conv, 2->Ret)
    const POSITION_TO_ID = {
      8: 'acquisition',
      1: 'conversion',
      2: 'retention',
      3: 'how',
      4: 'calltoact',
      5: 'intentions',
      6: 'interest',
      7: 'what'
    };

    const nodeId = POSITION_TO_ID[node.position];

    // 3. Open the Strategic Advice Modal
    const localizedAdvice = getLocalizedStrategicAdvice(i18n.language);
    if (localizedAdvice[nodeId]) {
      const advice = localizedAdvice[nodeId];
      const highlightedPos = getHighlightedPositions(node.position);
      const nodeIds = highlightedPos.map(pos => COMPASS_NODES[pos].id);

      setSelectedAdvice(advice);
      setSelectedNodeNames(nodeIds);
      setIsModalOpen(true);

      // Store last seen advice for other tools (like Pitch Master)
      localStorage.setItem('imi-last-advice', JSON.stringify({
        nodeId,
        advice,
        timestamp: new Date().getTime()
      }));
    }

    // 4. Also update global objective if it's a primary objective node
    const OBJECTIVE_NODES = {
      8: 'acquisition',
      1: 'conversion',
      2: 'retention'
    };
    const objectiveId = OBJECTIVE_NODES[node.position];
    if (objectiveId) {
      setFormData(prev => ({ ...prev, objective: objectiveId }));
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand-section">
            <Compass size={40} color="var(--electric-blue)" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 className="brand-title">{t('header.title')}</h1>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--slate-gray)',
                  opacity: 0.7,
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '2px 6px',
                  borderRadius: '12px'
                }}>v0.1.7</span>
              </div>
              <p className="brand-subtitle">{t('header.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="language-selector">
              <button
                className={`lang-btn ${i18n.language.startsWith('en') ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('en')}
              >
                EN
              </button>
              <button
                className={`lang-btn ${i18n.language.startsWith('fr') ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('fr')}
              >
                FR
              </button>
            </div>
            <ProfileSwitcher
              currentIndex={currentProfileIndex}
              onSwitch={setCurrentProfileIndex}
              t={t}
              onExport={handleExportAll}
              onImport={handleImportAll}
              onShowInfo={() => setShowBackupInfoModal(true)}
              onResetProfile={handleResetProfile}
              onResetAll={handleResetAll}
            />
            <nav className="tool-navigation">
              <button
                className={`nav-btn ${currentView === 'core-profiler' ? 'active' : ''}`}
                onClick={() => setCurrentView('core-profiler')}
                title={t('core_profiler.title') || "Core Profiler"}
              >
                <Target size={20} />
                <span>{t('nav.core_profiler') || 'Core Profiler'} <span className="ai-badge">AI</span></span>
              </button>
              <button
                className={`nav-btn ${currentView === 'compass' ? 'active' : ''}`}
                onClick={() => setCurrentView('compass')}
                title={t('nav.compass')}
              >
                <Compass size={20} />
                <span>{t('nav.compass')}</span>
              </button>
              <button
                className={`nav-btn ${currentView === 'brand-evaluator' ? 'active' : ''}`}
                onClick={() => setCurrentView('brand-evaluator')}
                title={t('nav.brand')}
              >
                <Award size={20} />
                <span>{t('nav.brand')} <span className="ai-badge">AI</span></span>
              </button>
              <button
                className={`nav-btn ${currentView === 'product-profiler' ? 'active' : ''}`}
                onClick={() => setCurrentView('product-profiler')}
                title={t('nav.product')}
              >
                <Package size={20} />
                <span>{t('nav.product')} <span className="ai-badge">AI</span></span>
              </button>
              <button
                className={`nav-btn ${currentView === 'prospect-profiler' ? 'active' : ''}`}
                onClick={() => setCurrentView('prospect-profiler')}
                title={t('nav.prospect')}
              >
                <Users size={20} />
                <span>{t('nav.prospect')} <span className="ai-badge">AI</span></span>
              </button>
              <button
                className={`nav-btn ${currentView === 'conversation-guide' ? 'active' : ''}`}
                onClick={() => setCurrentView('conversation-guide')}
                title={t('nav.guide')}
              >
                <MessageCircle size={20} />
                <span>{t('nav.guide')}</span>
              </button>
              <button
                className={`nav-btn ${currentView === 'asset-ai' ? 'active' : ''}`}
                onClick={() => setCurrentView('asset-ai')}
                title={t('nav.asset')}
              >
                <Layout size={20} />
                <span>{t('nav.asset')} <span className="ai-badge">AI</span></span>
              </button>

              <button
                className={`nav-btn pitch-master-btn ${currentView === 'pitch-master' ? 'active' : ''} ${!allToolsCompleted ? 'locked' : ''}`}
                onClick={() => {
                  if (allToolsCompleted) {
                    setCurrentView('pitch-master');
                  } else {
                    setShowUnlockGuide(true);
                  }
                }}
                title={allToolsCompleted ? t('nav.pitch') : t('nav.locked')}
              >
                <div className="btn-inner">
                  {!allToolsCompleted ? <Lock size={16} /> : <Sparkles size={18} color="var(--electric-blue)" />}
                  <span>{t('nav.pitch')}</span>
                </div>
                {!allToolsCompleted && <span className="cta-text">{t('nav.locked')}</span>}
              </button>
              <button
                className={`nav-btn progress-tracker-btn ${currentView === 'progress-tracker' ? 'active' : ''} ${(!allToolsCompleted && !isTrackerUnlocked) ? 'locked' : ''}`}
                onClick={() => {
                  if (allToolsCompleted || isTrackerUnlocked) {
                    setCurrentView('progress-tracker');
                  } else {
                    setShowUnlockModal(true);
                  }
                }}
                title={(allToolsCompleted || isTrackerUnlocked) ? t('nav.tracker') : t('nav.locked')}
              >
                <div className="btn-inner">
                  {(!allToolsCompleted && !isTrackerUnlocked) ? <Lock size={16} /> : <ClipboardList size={20} color="var(--electric-blue)" />}
                  <span>{t('nav.tracker')}</span>
                </div>
                {(!allToolsCompleted && !isTrackerUnlocked) && <span className="cta-text">{t('nav.locked')}</span>}
              </button>
              <button
                className={`nav-btn elite-challenges-btn ${currentView === 'elite-challenges' ? 'active' : ''} ${!isEliteUnlocked ? 'locked' : ''}`}
                onClick={() => {
                  if (isEliteUnlocked) {
                    setCurrentView('elite-challenges');
                  } else {
                    setShowMemberModal(true);
                  }
                }}
                title={isEliteUnlocked ? t('nav.elite') : t('nav.locked')}
              >
                <div className="btn-inner">
                  {!isEliteUnlocked ? <Lock size={16} /> : <Crown size={20} color="var(--electric-blue)" />}
                  <span>{t('nav.elite')}</span>
                </div>
                {!isEliteUnlocked && <span className="cta-text">{t('nav.locked')}</span>}
              </button>
              <button
                className={`nav-btn solocorp-btn ${currentView === 'solocorp' ? 'active' : ''}`}
                onClick={() => setCurrentView('solocorp')}
                title={t('nav.soloCorp')}
              >
                <div className="btn-inner">
                  <Flame size={20} color="var(--amber-gold)" />
                  <span>{t('nav.soloCorp')} <span className="ai-badge">AI</span></span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header >

      <main className="main-content w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10" style={{ margin: '0 auto' }}>
        <div key={currentProfileIndex}>
          {currentView === 'core-profiler' ? (
            <CoreProfiler profileIndex={currentProfileIndex} allToolsCompleted={allToolsCompleted} />
          ) : currentView === 'compass' ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Column: Compass */}
                <div className="lg:sticky lg:top-10">
                  <CompassWheel
                    selectedObjective={selectedObjective}
                    apexPosition={compassApex}
                    onNodeClick={handleNodeClick}
                    centerFocus={formData.focus}
                    onCenterClick={handleCenterClick}
                  />
                </div>

                {/* Right Column: Form */}
                <div>
                  <MarketingForm
                    formData={formData}
                    setFormData={setFormData} // Changed from onFormChange to setFormData based on original
                    onObjectiveChange={handleObjectiveChange}
                    onGenerate={handleGenerateReport} // Changed from onGenerateReport to onGenerate based on original
                  />
                </div>
              </div>

              {showReport && selectedObjective && (
                <div id="report-section" className="report-section mt-10"> {/* Added mt-10 based on original */}
                  <ReportGenerator
                    formData={formData}
                    selectedObjective={selectedObjective}
                  />
                </div>
              )}
            </>
          ) : currentView === 'brand-evaluator' ? (
            <BrandEvaluator profileIndex={currentProfileIndex} />
          ) : currentView === 'product-profiler' ? (
            <ProductProfiler profileIndex={currentProfileIndex} />
          ) : currentView === 'prospect-profiler' ? (
            <ProspectProfiler profileIndex={currentProfileIndex} />
          ) : currentView === 'conversation-guide' ? (
            <ConversationGuide allToolsCompleted={allToolsCompleted} profileIndex={currentProfileIndex} />
          ) : currentView === 'asset-ai' ? (
            <AssetAI profileIndex={currentProfileIndex} />
          ) : currentView === 'pitch-master' ? (
            <StrategicAdvisor profileIndex={currentProfileIndex} />
          ) : currentView === 'progress-tracker' ? (
            <ProgressTracker profileIndex={currentProfileIndex} />
          ) : currentView === 'elite-challenges' ? (
            <EliteChallenges profileIndex={currentProfileIndex} />
          ) : currentView === 'solocorp' ? (
            <SoloCorp101 profileIndex={currentProfileIndex} />
          ) : null}
        </div>
      </main>

      {/* Unlock Modal */}
      {
        showUnlockModal && (
          <div className="modal-overlay" onClick={() => setShowUnlockModal(false)}>
            <div className="node-advice-modal unlock-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowUnlockModal(false)}><X /></button>
              <div className="modal-content">
                <h2 className="modal-title">{t('unlock.title')}</h2>
                <p className="mt-4 mb-6 text-gray-400">{t('unlock.description')}</p>
                <form onSubmit={handleUnlockSubmit} className="space-y-4">
                  <input
                    type="password"
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value)}
                    placeholder={t('unlock.placeholder')}
                    className="w-full bg-black/30 border border-blue-500/30 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    autoFocus
                  />
                  {unlockError && <p className="text-red-500 text-sm">{t('unlock.error')}</p>}
                  <button type="submit" className="premium-btn w-full justify-center">
                    {t('unlock.submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* Member Unlock Modal */}
      {
        showMemberModal && (
          <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
            <div className="node-advice-modal unlock-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowMemberModal(false)}><X /></button>
              <div className="modal-content">
                <h2 className="modal-title">{t('member.title')}</h2>
                <p className="mt-4 mb-6 text-gray-400">{t('member.description')}</p>
                <form onSubmit={handleMemberSubmit} className="space-y-4">
                  <input
                    type="password"
                    value={memberCode}
                    onChange={(e) => setMemberCode(e.target.value)}
                    placeholder={t('member.placeholder')}
                    className="w-full bg-black/30 border border-blue-500/30 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    autoFocus
                  />
                  {memberError && <p className="text-red-500 text-sm">{t('member.error')}</p>}
                  <button type="submit" className="premium-btn w-full justify-center">
                    {t('member.submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* Backup Info Modal */}
      {
        showBackupInfoModal && (
          <div className="modal-overlay" onClick={() => setShowBackupInfoModal(false)}>
            <div className="node-advice-modal backup-info-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowBackupInfoModal(false)}><X /></button>
              <div className="modal-content">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle size={28} className="text-blue-500" />
                  <h2 className="modal-title m-0">{t('profiles.backup_info.title')}</h2>
                </div>

                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                      <Sparkles size={16} className="text-yellow-500" />
                      {t('profiles.backup_info.nature').split(':')[0]}
                    </h3>
                    <p className="text-sm leading-relaxed">{t('profiles.backup_info.nature').split(':')[1]}</p>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                      <Download size={16} className="text-blue-500" />
                      {t('profiles.backup_info.storage').split(':')[0]}
                    </h3>
                    <p className="text-sm leading-relaxed">{t('profiles.backup_info.storage').split(':')[1]}</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {t('profiles.backup_info.best_practices')}
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{t('profiles.backup_info.tip1')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{t('profiles.backup_info.tip2')}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{t('profiles.backup_info.tip3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  className="premium-btn w-full justify-center mt-8"
                  onClick={() => setShowBackupInfoModal(false)}
                >
                  {t('profiles.backup_info.close')}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Strategic Advice Modal */}
      <NodeAdviceModal
        isOpen={isModalOpen}
        onClose={handleNodeModalClose}
        advice={selectedAdvice}
        nodeNames={selectedNodeNames}
      />

      <UnlockGuideModal
        isOpen={showUnlockGuide}
        onClose={() => setShowUnlockGuide(false)}
        completions={toolCompletions}
        onNavigate={(view) => {
          setCurrentView(view);
          setShowUnlockGuide(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <CenterAdviceModal
        isOpen={showCenterModal}
        onClose={() => setShowCenterModal(false)}
        advice={currentCenterAdvice}
        type={(formData?.focus || 'who').toLowerCase()}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div >
  );
}

export default App;
