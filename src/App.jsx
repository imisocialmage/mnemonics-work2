import { useState, useEffect } from 'react';
import { OBJECTIVES } from './data/compassData';
import CompassWheel from './components/Compass/CompassWheel';
import MarketingForm from './components/Form/MarketingForm';
import ReportGenerator from './components/Report/ReportGenerator';
import BrandEvaluator from './components/BrandEvaluator/BrandEvaluator';
import ProductProfiler from './components/ProductProfiler/ProductProfiler';
import ProspectProfiler from './components/ProspectProfiler/ProspectProfiler';
import ConversationGuide from './components/ConversationGuide/ConversationGuide';
import StrategicAdvisor from './components/StrategicAdvisor/StrategicAdvisor';
import { Compass, Award, Package, Users, MessageCircle, Sparkles, Lock } from 'lucide-react';
import { generateMasterReport } from './components/Report/MasterReportGenerator';
import './index.css';

function App() {
  // View state: 'compass' | 'brand-evaluator' | 'product-profiler' | 'prospect-profiler' | 'conversation-guide'
  const [currentView, setCurrentView] = useState('compass');

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('imi-compass-data');
    return saved ? JSON.parse(saved) : {
      objective: '',
      focus: 'who',
      brandName: '',
      audience: '',
      challenge: ''
    };
  });

  // Save compass data to localStorage
  useEffect(() => {
    localStorage.setItem('imi-compass-data', JSON.stringify(formData));
  }, [formData]);

  // Independent state for the visual compass rotation
  const [compassApex, setCompassApex] = useState(null);

  // State to control report visibility
  const [showReport, setShowReport] = useState(false);

  // Track tool completions for master report
  const [toolCompletions, setToolCompletions] = useState(() => {
    const saved = localStorage.getItem('imi-tool-completions');
    return saved ? JSON.parse(saved) : {
      compass: false,
      brandEvaluator: false,
      productProfiler: false,
      prospectProfiler: false,
      conversationGuide: false
    };
  });

  // Save completions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('imi-tool-completions', JSON.stringify(toolCompletions));
  }, [toolCompletions]);

  // Check if all tools are completed
  const allToolsCompleted = Object.values(toolCompletions).every(Boolean);

  // Listen for tool completion events
  useEffect(() => {
    const handleToolComplete = (event) => {
      const toolName = event.detail;
      setToolCompletions(prev => ({ ...prev, [toolName]: true }));
    };

    window.addEventListener('tool-completed', handleToolComplete);
    return () => window.removeEventListener('tool-completed', handleToolComplete);
  }, []);

  // Listen for cross-tool navigation events
  useEffect(() => {
    const handleNavigate = (event) => {
      setCurrentView(event.detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('navigate-to-tool', handleNavigate);
    return () => window.removeEventListener('navigate-to-tool', handleNavigate);
  }, []);

  // Listen for master report download event
  useEffect(() => {
    const handleDownloadMaster = () => {
      try {
        generateMasterReport();
      } catch (error) {
        console.error("Master Report Error:", error);
        alert("There was an error generating the master report. Please ensure you have completed some tools first.");
      }
    };

    window.addEventListener('download-master-report', handleDownloadMaster);
    return () => window.removeEventListener('download-master-report', handleDownloadMaster);
  }, []);

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

  const handleNodeClick = (node) => {
    // 1. Always rotate the visual compass
    setCompassApex(node.position);

    // 2. Map position to objective (Original logic: 8->Acq, 1->Conv, 3->Ret)
    // Note: 'Retention' is node 2, but triggers on node 3 in original?
    // User source: "if (objectiveToPosition['retention'] === clickedPosition) ..." 
    // where 'retention': 3. So clicking node 3 triggers retention.
    // Clicking node 2 (Retention label) just rotates to 2.

    const POSITION_TO_ID = {
      8: 'acquisition',
      1: 'conversion',
      2: 'retention'
    };

    const objectiveId = POSITION_TO_ID[node.position];

    if (objectiveId) {
      setFormData(prev => ({ ...prev, objective: objectiveId }));
    }
    // If not an objective position, we DO NOT change the form objective (matches original 'return' behavior)
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand-section">
            <Compass size={40} color="var(--electric-blue)" />
            <div>
              <h1 className="brand-title">IMI Marketing Compass</h1>
              <p className="brand-subtitle">Navigate Your Strategy Through Conversation, Not Coercion</p>
            </div>
          </div>
          <nav className="tool-navigation">
            <button
              className={`nav-btn ${currentView === 'compass' ? 'active' : ''}`}
              onClick={() => setCurrentView('compass')}
              title="Marketing Compass"
            >
              <Compass size={20} />
              <span>Compass</span>
            </button>
            <button
              className={`nav-btn ${currentView === 'brand-evaluator' ? 'active' : ''}`}
              onClick={() => setCurrentView('brand-evaluator')}
              title="Brand Evaluation Tool"
            >
              <Award size={20} />
              <span>Brand</span>
            </button>
            <button
              className={`nav-btn ${currentView === 'product-profiler' ? 'active' : ''}`}
              onClick={() => setCurrentView('product-profiler')}
              title="Product Profiler"
            >
              <Package size={20} />
              <span>Product</span>
            </button>
            <button
              className={`nav-btn ${currentView === 'prospect-profiler' ? 'active' : ''}`}
              onClick={() => setCurrentView('prospect-profiler')}
              title="Prospect Profiler"
            >
              <Users size={20} />
              <span>Prospect</span>
            </button>
            <button
              className={`nav-btn ${currentView === 'conversation-guide' ? 'active' : ''}`}
              onClick={() => setCurrentView('conversation-guide')}
              title="Conversation Guide"
            >
              <MessageCircle size={20} />
              <span>Guide</span>
            </button>
            <button
              className={`nav-btn ${currentView === 'pitch-master' ? 'active' : ''} ${!allToolsCompleted ? 'locked' : ''}`}
              onClick={() => allToolsCompleted && setCurrentView('pitch-master')}
              title={allToolsCompleted ? "Strategic Pitch Master" : "Complete all steps to unlock"}
              style={{ flexDirection: 'column', alignItems: 'center', minWidth: '160px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!allToolsCompleted ? <Lock size={16} /> : <Sparkles size={18} color="var(--electric-blue)" />}
                <span>Pitch Master</span>
              </div>
              {!allToolsCompleted && <span className="cta-text">Complete all steps to unlock</span>}
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content max-w-7xl mx-auto px-6 py-10">
        {currentView === 'compass' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: Compass */}
              <div className="sticky top-10">
                <CompassWheel
                  selectedObjective={selectedObjective}
                  apexPosition={compassApex}
                  onNodeClick={handleNodeClick}
                  centerFocus={formData.focus}
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
          <BrandEvaluator />
        ) : currentView === 'product-profiler' ? (
          <ProductProfiler />
        ) : currentView === 'prospect-profiler' ? (
          <ProspectProfiler />
        ) : currentView === 'conversation-guide' ? (
          <ConversationGuide allToolsCompleted={allToolsCompleted} />
        ) : currentView === 'pitch-master' ? (
          <StrategicAdvisor />
        ) : null}
      </main>
    </div>
  );
}

export default App;
