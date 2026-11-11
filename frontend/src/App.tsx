import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { PlateVisualization } from './pages/PlateVisualization';
import { SignalAnalysis } from './pages/SignalAnalysis';
import { AIClassification } from './pages/AIClassification';
import { ModelEvaluation } from './pages/ModelEvaluation';
import { DatasetManagement } from './pages/DatasetManagement';
import { AnalysisHistory } from './pages/AnalysisHistory';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('landing');

  const handleQuickAcquire = () => {
    setCurrentPath('signal-analysis');
  };

  const handleQuickReport = () => {
    setCurrentPath('reports');
  };

  return (
    <div className="min-h-screen bg-[#061426] text-[#d6e3fe] flex">
      {/* If Landing Page, render standalone landing view */}
      {currentPath === 'landing' ? (
        <div className="w-full">
          <LandingPage
            onStartAnalysis={() => setCurrentPath('dashboard')}
            onExploreModules={(module) => setCurrentPath(module)}
          />
        </div>
      ) : (
        /* Authenticated Application Shell */
        <div className="flex w-full">
          {/* Fixed Navigation Sidebar */}
          <Sidebar currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />

          {/* Main Layout Area */}
          <div className="flex-1 pl-72 flex flex-col min-h-screen">
            <Header onQuickAcquire={handleQuickAcquire} onQuickReport={handleQuickReport} />

            <main className="pt-16 min-h-[calc(100vh-4rem)] bg-[#061426]">
              {currentPath === 'dashboard' && (
                <Dashboard
                  onNavigate={(path) => setCurrentPath(path)}
                  onQuickAcquire={handleQuickAcquire}
                  onQuickReport={handleQuickReport}
                />
              )}
              {currentPath === 'plate-visualization' && <PlateVisualization />}
              {currentPath === 'signal-analysis' && <SignalAnalysis />}
              {currentPath === 'ai-classification' && <AIClassification onNavigateToReports={() => setCurrentPath('reports')} />}
              {currentPath === 'model-evaluation' && <ModelEvaluation />}
              {currentPath === 'dataset-management' && <DatasetManagement />}
              {currentPath === 'analysis-history' && <AnalysisHistory />}
              {currentPath === 'reports' && <Reports />}
              {currentPath === 'settings' && <Settings />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

