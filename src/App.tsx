import React, { useState, useCallback } from 'react';
import { SCENARIOS, INITIAL_QUERY_LOGS } from './data/scenarios';
import type { ScenarioId, SensorModality, QueryLogEntry } from './types';
import { Header } from './components/Header';
import { QueryConsole } from './components/QueryPanel/QueryConsole';
import { MapViewer } from './components/MapViewer/MapViewer';
import { TracePanel } from './components/TracePanel/TracePanel';

export const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('kochi-flood');
  const [queryLogs, setQueryLogs] = useState<QueryLogEntry[]>(INITIAL_QUERY_LOGS);
  const [isQueryCollapsed, setIsQueryCollapsed] = useState<boolean>(false);
  const [isTraceOpen, setIsTraceOpen] = useState<boolean>(true);
  const [traceLayoutMode, setTraceLayoutMode] = useState<'bottom' | 'right'>('right');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [activeRunningStep, setActiveRunningStep] = useState<number | null>(null);

  const activeScenario = SCENARIOS[activeScenarioId] || SCENARIOS['kochi-flood'];

  // Handle Scenario Switch
  const handleSelectScenario = useCallback((id: ScenarioId) => {
    setActiveScenarioId(id);
    setSelectedFeatureId(null);
  }, []);

  // Simulate step-by-step DAG execution
  const runSimulation = useCallback(() => {
    const totalSteps = activeScenario.dagNodes.length;
    let step = 1;
    setActiveRunningStep(1);

    const interval = setInterval(() => {
      step += 1;
      if (step <= totalSteps) {
        setActiveRunningStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => setActiveRunningStep(null), 800);
      }
    }, 450);
  }, [activeScenario]);

  // Handle Natural Language Query Submission
  const handleSubmitQuery = useCallback(
    (queryText: string, modality: SensorModality) => {
      const lower = queryText.toLowerCase();
      let targetScenario: ScenarioId = 'kochi-flood';

      if (lower.includes('joshimath') || lower.includes('subsidence') || lower.includes('slope') || lower.includes('insar')) {
        targetScenario = 'joshimath-subsidence';
      } else if (lower.includes('sundar') || lower.includes('mangrove') || lower.includes('cyclone') || lower.includes('shoreline')) {
        targetScenario = 'sundarbans-erosion';
      }

      setActiveScenarioId(targetScenario);
      setSelectedFeatureId(null);

      // Create new log entry
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 8) + ' UTC';

      const matchedScenario = SCENARIOS[targetScenario];
      const newEntry: QueryLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        queryText,
        scenarioId: targetScenario,
        status: 'resolved',
        sensorTags:
          modality === 'sar'
            ? ['Sentinel-1 SAR', 'Dual-Pol']
            : modality === 'optical'
            ? ['Sentinel-2 MSI', 'RGB']
            : ['Multi-Sensor', 'SAR + Optical'],
        aoiName: matchedScenario.locationName,
        confidenceScore: matchedScenario.groundingFeatures[0]?.confidence || 0.965,
        summarySnippet: matchedScenario.naturalAnswer.substring(0, 120) + '...',
        executionTimeSec: +(Math.random() * 0.8 + 1.6).toFixed(2),
        groundedFeatureCount: matchedScenario.groundingFeatures.length,
      };

      setQueryLogs((prev) => [newEntry, ...prev]);

      // Automatically trigger live execution visualization on the DAG
      runSimulation();
    },
    [runSimulation]
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-sat-950 text-sat-200 overflow-hidden font-sans select-none">
      {/* 1. Technical Ground-Station Mission Header */}
      <Header
        currentScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        isTraceOpen={isTraceOpen}
        onToggleTrace={() => setIsTraceOpen(!isTraceOpen)}
        traceLayoutMode={traceLayoutMode}
        onToggleTraceLayout={() =>
          setTraceLayoutMode((prev) => (prev === 'bottom' ? 'right' : 'bottom'))
        }
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Region: Query Console (Collapsible) */}
        <QueryConsole
          logs={queryLogs}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          onSubmitQuery={handleSubmitQuery}
          activeScenario={activeScenario}
          isCollapsed={isQueryCollapsed}
          onToggleCollapse={() => setIsQueryCollapsed(!isQueryCollapsed)}
        />

        {/* Center & Right/Bottom Regions */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Sub-layout: Either [Map + Right Trace] OR [Map over Bottom Trace] */}
          {traceLayoutMode === 'right' ? (
            <div className="flex-1 flex overflow-hidden relative">
              {/* Center Region: Map / Imagery Viewer (Dominant) */}
              <div className="flex-1 relative h-full">
                <MapViewer
                  scenario={activeScenario}
                  selectedFeatureId={selectedFeatureId}
                  onSelectFeature={setSelectedFeatureId}
                />
              </div>

              {/* Right Region: Execution Trace Panel (35% width when open) */}
              {isTraceOpen && (
                <div className="w-[38%] lg:w-[35%] xl:w-[32%] h-full shrink-0 z-20 transition-all">
                  <TracePanel
                    dagNodes={activeScenario.dagNodes}
                    layoutMode="right"
                    onToggleLayoutMode={() => setTraceLayoutMode('bottom')}
                    isOpen={isTraceOpen}
                    onToggleOpen={() => setIsTraceOpen(!isTraceOpen)}
                    onSimulateExecution={runSimulation}
                    activeRunningStep={activeRunningStep}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Center Region: Map / Imagery Viewer (Dominant) */}
              <div className="flex-1 relative w-full">
                <MapViewer
                  scenario={activeScenario}
                  selectedFeatureId={selectedFeatureId}
                  onSelectFeature={setSelectedFeatureId}
                />
              </div>

              {/* Bottom Region: Execution Trace Drawer (38% height when open) */}
              {isTraceOpen && (
                <div className="h-[40%] w-full shrink-0 z-20 transition-all">
                  <TracePanel
                    dagNodes={activeScenario.dagNodes}
                    layoutMode="bottom"
                    onToggleLayoutMode={() => setTraceLayoutMode('right')}
                    isOpen={isTraceOpen}
                    onToggleOpen={() => setIsTraceOpen(!isTraceOpen)}
                    onSimulateExecution={runSimulation}
                    activeRunningStep={activeRunningStep}
                  />
                </div>
              )}
            </div>
          )}

          {/* Minimized Trace Floating Bar if collapsed */}
          {!isTraceOpen && (
            <div className="absolute bottom-3 right-3 z-30">
              <TracePanel
                dagNodes={activeScenario.dagNodes}
                layoutMode={traceLayoutMode}
                onToggleLayoutMode={() =>
                  setTraceLayoutMode((prev) => (prev === 'bottom' ? 'right' : 'bottom'))
                }
                isOpen={isTraceOpen}
                onToggleOpen={() => setIsTraceOpen(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
