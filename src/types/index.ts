export type ScenarioId = 'kochi-flood' | 'joshimath-subsidence' | 'sundarbans-erosion';

export type SensorModality = 'all' | 'optical' | 'sar' | 'multimodal';

export type ViewMode = 'split' | 'pre' | 'post' | 'difference';

export type ImageryLayerType =
  | 'optical_rgb'
  | 'sar_coherence'
  | 'ndvi_canopy'
  | 'sar_inundation'
  | 'insar_deformation'
  | 'cyclone_surge'
  | 'change_mask'
  | 'composite';

export interface GroundingPolygon {
  id: string;
  label: string;
  category: 'inundation' | 'infrastructure_risk' | 'canopy_loss' | 'embankment_breach' | 'ground_deformation';
  confidence: number;
  areaHectares: number;
  color: string;
  /** Normalized polygon points [x%, y%] inside 0-100 viewport */
  points: [number, number][];
  bbox: [number, number, number, number]; // [minX, minY, maxX, maxY] in %
  telemetry: {
    backscatterShiftDb?: string;
    waterDepthEstimate?: string;
    displacementRateMmYr?: string;
    vegetationLossPct?: string;
    soilMoistureIndex?: string;
    cloudInterferencePct?: number;
    sensorCoherence?: number;
  };
}

export type DagStepStatus = 'completed' | 'running' | 'queued' | 'failed';

export interface DagNodeTelemetry {
  id: string;
  stepNumber: number;
  title: string;
  specialistModel: string;
  status: DagStepStatus;
  latencyMs: number;
  confidence: number;
  summary: string;
  category: 'ingest' | 'alignment' | 'spectroradiometry' | 'segmentation' | 'vlm_reasoning' | 'synthesis';
  details: {
    inputs: Record<string, string | number | boolean | string[] | number[]>;
    outputs: Record<string, string | number | boolean | string[] | number[]>;
    rationale: string;
    architecture: string;
    weights: string;
    tensorShape?: string;
    intermediateSnippet?: string;
  };
}

export interface MetricItem {
  label: string;
  value: string;
  unit: string;
  change?: string;
  severity: 'normal' | 'warning' | 'critical';
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  shortTitle: string;
  locationName: string;
  stateCountry: string;
  initialQuery: string;
  timestampUtc: string;
  coordinates: {
    lat: number;
    lon: number;
    utmZone: string;
    mgrs: string;
    bounds: { north: number; south: number; east: number; west: number };
  };
  telemetry: {
    gsd: string;
    sunElevation: string;
    satelliteAzimuth: string;
    sensorIncidence: string;
    constellation: string[];
    revisitCycle: string;
  };
  preEvent: {
    date: string;
    label: string;
    satellite: string;
    sensor: string;
    description: string;
    layerType: ImageryLayerType;
  };
  postEvent: {
    date: string;
    label: string;
    satellite: string;
    sensor: string;
    description: string;
    layerType: ImageryLayerType;
  };
  naturalAnswer: string;
  keyMetrics: MetricItem[];
  groundingFeatures: GroundingPolygon[];
  dagNodes: DagNodeTelemetry[];
}

export interface QueryLogEntry {
  id: string;
  timestamp: string;
  queryText: string;
  scenarioId: ScenarioId;
  status: 'resolved' | 'processing';
  sensorTags: string[];
  aoiName: string;
  confidenceScore: number;
  summarySnippet: string;
  executionTimeSec: number;
  groundedFeatureCount: number;
}
