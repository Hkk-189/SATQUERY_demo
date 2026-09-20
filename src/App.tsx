import React, { useState, useCallback } from 'react';
import { SCENARIOS, INITIAL_QUERY_LOGS } from './data/scenarios';
import type { ScenarioId, SensorModality, QueryLogEntry } from './types';
import { Header } from './components/Header';
import { QueryConsole } from './components/QueryPanel/QueryConsole';
import { MapViewer } from './components/MapViewer/MapViewer';

export const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('kochi-flood');
  const [queryLogs, setQueryLogs] = useState<QueryLogEntry[]>(INITIAL_QUERY_LOGS);
  const [isQueryCollapsed, setIsQueryCollapsed] = useState<boolean>(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  const activeScenario = SCENARIOS[activeScenarioId] || SCENARIOS['kochi-flood'];

  // Handle Scenario Switch
  const handleSelectScenario = useCallback((id: ScenarioId) => {
    setActiveScenarioId(id);
    setSelectedFeatureId(null);
  }, []);

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
    },
    []
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-sat-950 text-sat-200 overflow-hidden font-sans select-none">
      {/* 1. Technical Ground-Station Mission Header */}
      <Header
        currentScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
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

        {/* Center Region: Map / Imagery Viewer (Dominant Full Workspace) */}
        <div className="flex-1 relative h-full overflow-hidden">
          <MapViewer
            scenario={activeScenario}
            selectedFeatureId={selectedFeatureId}
            onSelectFeature={setSelectedFeatureId}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
