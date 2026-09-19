import type { Scenario, QueryLogEntry } from '../types';

export const SCENARIOS: Record<string, Scenario> = {
  'kochi-flood': {
    id: 'kochi-flood',
    title: 'Kochi & Periyar River Basin Monsoon Inundation',
    shortTitle: 'Kochi Flood Analysis',
    locationName: 'Kochi Metropolitan & Periyar Basin',
    stateCountry: 'Kerala, India',
    initialQuery: 'Show me flooding near Kochi in the last month and identify impacted transport corridors',
    timestampUtc: '2024-08-14T06:42:18Z',
    coordinates: {
      lat: 9.9816,
      lon: 76.2999,
      utmZone: '43N',
      mgrs: '43PFL421033',
      bounds: {
        north: 10.155,
        south: 9.870,
        west: 76.150,
        east: 76.450,
      }
    },
    telemetry: {
      gsd: '10.0m (Sentinel-1 SAR) / 10.0m (Sentinel-2 MSI)',
      sunElevation: '58.4°',
      satelliteAzimuth: '102.1°',
      sensorIncidence: '39.2° (Center swath)',
      constellation: ['Sentinel-1A (C-SAR)', 'Sentinel-2B (MSI)', 'ISRO EOS-04'],
      revisitCycle: '6 days (Constellation merge)',
    },
    preEvent: {
      date: '2024-07-12',
      label: 'Pre-Event Baseline (Optical Sentinel-2 L2A)',
      satellite: 'Sentinel-2B MSI',
      sensor: 'Multi-Spectral BOA Reflectance',
      description: 'Pre-monsoon normal water levels, urban infrastructure, agricultural paddies, and backwater canals.',
      layerType: 'optical_rgb',
    },
    postEvent: {
      date: '2024-08-14',
      label: 'Post-Event Analysis (SAR C-Band Dual-Pol + Flood Mask)',
      satellite: 'Sentinel-1A C-SAR',
      sensor: 'Synthetic Aperture Radar (VV+VH)',
      description: 'Penetrates dense monsoon cumulus cloud cover. Shows specular reflection drop on standing water bodies.',
      layerType: 'sar_inundation',
    },
    naturalAnswer: 'Analysis of Sentinel-1 C-SAR radar backscatter (VV/VH dual-polarization) combined with Sentinel-2 pre-event baseline confirms extensive inundation across 4,625 hectares in the lower Periyar river basin and northern Kochi backwaters. Severe backscatter attenuation (Δσ⁰ < -5.4 dB) indicates standing floodwaters with depths ranging from 0.8m to 2.3m. Critical infrastructure disruption is detected along the Aluva transport junction, NH-544 highway corridor, and industrial warehousing zones near Kalamassery.',
    keyMetrics: [
      {
        label: 'Total Inundation Area',
        value: '4,625',
        unit: 'ha',
        change: '+318% vs July baseline',
        severity: 'critical',
      },
      {
        label: 'Critical Infra at Risk',
        value: '14.2',
        unit: 'km',
        change: 'Highway & rail segments',
        severity: 'critical',
      },
      {
        label: 'Radar Specular Attenuation',
        value: '-5.8',
        unit: 'dB',
        change: 'VV/VH backscatter shift',
        severity: 'warning',
      },
      {
        label: 'Cloud Penetration Ratio',
        value: '100%',
        unit: 'SAR C-Band',
        change: 'Optical obstructed (92% clouds)',
        severity: 'normal',
      }
    ],
    groundingFeatures: [
      {
        id: 'gf-kochi-1',
        label: 'Periyar River Spillway & Aluva Lowlands',
        category: 'inundation',
        confidence: 0.968,
        areaHectares: 1820,
        color: '#06b6d4',
        points: [
          [28, 22], [42, 18], [54, 26], [48, 38], [34, 40], [25, 32]
        ],
        bbox: [25, 18, 54, 40],
        telemetry: {
          backscatterShiftDb: '-6.4 dB (Specular void)',
          waterDepthEstimate: '1.4 - 2.3m',
          soilMoistureIndex: '0.94 (Saturation)',
          cloudInterferencePct: 0,
        }
      },
      {
        id: 'gf-kochi-2',
        label: 'Kalamassery Industrial Belt Submersion',
        category: 'infrastructure_risk',
        confidence: 0.934,
        areaHectares: 540,
        color: '#f43f5e',
        points: [
          [58, 42], [72, 38], [78, 50], [68, 58], [55, 52]
        ],
        bbox: [55, 38, 78, 58],
        telemetry: {
          backscatterShiftDb: '-4.9 dB',
          waterDepthEstimate: '0.8 - 1.2m',
          soilMoistureIndex: '0.88',
        }
      },
      {
        id: 'gf-kochi-3',
        label: 'NH-544 Highway Viaduct Cutoff Zone',
        category: 'infrastructure_risk',
        confidence: 0.912,
        areaHectares: 95,
        color: '#f97316',
        points: [
          [44, 44], [52, 43], [54, 48], [46, 49]
        ],
        bbox: [44, 43, 54, 49],
        telemetry: {
          backscatterShiftDb: '-5.1 dB',
          waterDepthEstimate: '0.6m (Pavement wash)',
        }
      },
      {
        id: 'gf-kochi-4',
        label: 'Vembanad Lake Northern Wetland Surge',
        category: 'inundation',
        confidence: 0.981,
        areaHectares: 2170,
        color: '#10b981',
        points: [
          [16, 52], [32, 48], [36, 68], [24, 82], [12, 74]
        ],
        bbox: [12, 48, 36, 82],
        telemetry: {
          backscatterShiftDb: '-7.2 dB',
          waterDepthEstimate: '2.1m standing head',
        }
      }
    ],
    dagNodes: [
      {
        id: 'node-1',
        stepNumber: 1,
        title: 'Query Parser & Geo-Disambiguation',
        specialistModel: 'SAC-Bhuvan Gazeteer + Llama-3-Geo',
        status: 'completed',
        latencyMs: 142,
        confidence: 0.992,
        category: 'ingest',
        summary: 'Extracted AOI Kochi (Kerala), temporal span [-30d], phenomenon: flood inundation & transport infra.',
        details: {
          inputs: {
            raw_text: 'Show me flooding near Kochi in the last month and identify impacted transport corridors',
            user_crs: 'EPSG:4326',
          },
          outputs: {
            aoi_bbox: [76.15, 9.87, 76.45, 10.155],
            resolved_toponym: 'Kochi-Periyar Basin, Ernakulam District',
            time_window: '2024-07-15T00:00:00Z to 2024-08-15T00:00:00Z',
            query_intents: ['Flood Extent', 'Change Detection', 'Critical Infrastructure Intersect'],
          },
          rationale: 'Toponym Kochi matched high-confidence polygon in ISRO SAC gazetteer. Temporal reference "last month" bounded against acquisition catalogs.',
          architecture: 'Bi-encoder Dense Retrieval + Geocoding Named Entity Recognition',
          weights: 'isro-sac-gazetteer-v2.1',
          tensorShape: 'B=1, T=38 tokens -> Embedding [1024]',
        }
      },
      {
        id: 'node-2',
        stepNumber: 2,
        title: 'STAC Catalog Query & Tasking Filter',
        specialistModel: 'Copernicus STAC & Bhoonidhi Ingest',
        status: 'completed',
        latencyMs: 285,
        confidence: 0.985,
        category: 'ingest',
        summary: 'Located 4 candidate scenes. Identified heavy cloud cover (92%) on optical passes; prioritized Sentinel-1 C-SAR IW GRD.',
        details: {
          inputs: {
            catalogs: ['Copernicus Data Space', 'ISRO Bhoonidhi Hub'],
            max_cloud_cover: '100% (SAR enabled)',
          },
          outputs: {
            selected_t1: 'S2B_MSIL2A_20240712T050659_N0511_R019 (Optical Cloud-free 10m)',
            selected_t2: 'S1A_IW_GRDH_1SDV_20240814T005322_055201_06BB02 (SAR C-Band 10m)',
            polarization: 'VV + VH dual-pol',
            orbit_direction: 'Ascending, Relative Orbit 56',
          },
          rationale: 'Monsoon cumulus and stratus obscuration rendered optical scenes unusable for peak-flood date (2024-08-14). SAR dual-polarization selected for all-weather penetration.',
          architecture: 'Spatio-Temporal Asset Catalog (STAC) Dynamic Optimizer',
          weights: 'stac-api-v1.0.0',
        }
      },
      {
        id: 'node-3',
        stepNumber: 3,
        title: 'Terrain Correction & Coregistration',
        specialistModel: 'ISRO Range-Doppler Geometric Engine',
        status: 'completed',
        latencyMs: 410,
        confidence: 0.978,
        category: 'alignment',
        summary: 'Sub-pixel co-registration with SRTM 30m DEM elevation. Radiometric calibration to sigma-nought (σ⁰) dB.',
        details: {
          inputs: {
            dem_source: 'SRTM GL1 30m Global Elevation',
            radiometric_calibration: 'Sigma0 (VV & VH)',
            speckle_filter: 'Lee Refined 5x5 window',
          },
          outputs: {
            rmse_spatial_alignment: '0.18 pixels (1.8 meters)',
            output_dimensions: [2048, 2048, 2],
            calibrated_range_db: '[-28.4 dB to +4.2 dB]',
          },
          rationale: 'High humidity and tropical coastal terrain require strict Range-Doppler terrain correction to eliminate geometric foreshortening near Kochi hills.',
          architecture: 'C++ CUDA Geospatial Orthorectifier & Despeckler',
          weights: 'gdal-warp-cuda-v3.8.4',
          tensorShape: '2048x2048x2 Float32',
        }
      },
      {
        id: 'node-4',
        stepNumber: 4,
        title: 'SAR Water Index & Otsu Thresholding',
        specialistModel: 'Sentinel Dual-Pol Water Index (SDWI)',
        status: 'completed',
        latencyMs: 195,
        confidence: 0.965,
        category: 'spectroradiometry',
        summary: 'Generated SDWI raster. Dual-polarized backscatter drop detected at Δσ⁰ < -5.4 dB across 4,625 hectares.',
        details: {
          inputs: {
            formula: 'SDWI = ln(10 * VV * VH) - 8.0',
            adaptive_thresholding: 'Bimodal Otsu variance minimization',
          },
          outputs: {
            inundation_area_sqkm: 46.25,
            false_alarm_rejection_pct: 98.4,
            permanent_water_excluded: '12.8 sq km (Vembanad normal tide)',
          },
          rationale: 'SDWI leverages the strong volume scattering decline of calm standing water in both VV and VH channels, effectively filtering wet soils from true flood submergence.',
          architecture: 'Parallelized Band-Math & Histogram Optimization',
          weights: 'sdwi-otsu-pipeline-2024',
          tensorShape: '2048x2048x1 uint8 (Mask)',
        }
      },
      {
        id: 'node-5',
        stepNumber: 5,
        title: 'SAM-Geospatial Boundary Delineation',
        specialistModel: 'Segment Anything Model (ViT-L-GeoSAM)',
        status: 'completed',
        latencyMs: 640,
        confidence: 0.952,
        category: 'segmentation',
        summary: 'Refined pixel clusters into clean vector polygons. Delineated 4 discrete critical zones with sub-10m fidelity.',
        details: {
          inputs: {
            encoder_backbone: 'ViT-L / 14 patch 1024 embedding',
            prompt_anchors: 'Positive centroids from Otsu threshold peaks',
            polygon_simplification: 'Douglas-Peucker epsilon=0.0001 deg',
          },
          outputs: {
            vector_polygons_count: 4,
            boundary_smoothness_score: '0.941',
            geojson_feature_collection: '4 Features, 182 vertices total',
          },
          rationale: 'Raw radar threshold rasters exhibit speckle noise at water boundaries. SAM-Geospatial prompt-conditioning aligns vector edges to terrain contours.',
          architecture: 'Vision Transformer (ViT-L) Dense Prompt Encoder + Mask Decoder',
          weights: 'geosam-vit-l-isro-satellite.pt',
          tensorShape: '1x256x64x64 mask embeddings',
        }
      },
      {
        id: 'node-6',
        stepNumber: 6,
        title: 'VLM Spatial Grounding & Anomaly Reasoner',
        specialistModel: 'Qwen2-VL-72B RemoteSensing + ISRO Bhuvan VLM',
        status: 'completed',
        latencyMs: 780,
        confidence: 0.945,
        category: 'vlm_reasoning',
        summary: 'Cross-validated vector polygons against OpenStreetMap road vectors. Detected active cutoff of NH-544.',
        details: {
          inputs: {
            imagery_chips: 'Btemporal Optical + SAR Chips [512x512]',
            vector_overlays: 'Highways, rail lines, industrial zones',
            system_prompt: 'Reason about infrastructure vulnerability and flood hazard causality.',
          },
          outputs: {
            verified_grounding: 'Confirmed 4 high-severity zones',
            critical_impact_finding: 'NH-544 inundated for 1.8km stretch near Aluva flyover approach',
            estimated_population_affected: '24,500 residents within 500m buffer',
          },
          rationale: 'Multi-modal reasoning combined visual context with spatial vectors to formulate high-fidelity domain narrative.',
          architecture: 'Autoregressive Vision-Language Transformer (72B Parameters)',
          weights: 'qwen2-vl-72b-geospatial-lora-v3',
        }
      },
      {
        id: 'node-7',
        stepNumber: 7,
        title: 'Mission Telemetry & GeoJSON Synthesis',
        specialistModel: 'SatQuery Cartographic Exporter',
        status: 'completed',
        latencyMs: 88,
        confidence: 0.999,
        category: 'synthesis',
        summary: 'Compiled bi-temporal raster overlays, bounding coordinates, telemetry metadata, and natural language briefing.',
        details: {
          inputs: {
            dag_trace_id: 'TRC-2024-KCH-0814-A01',
            vector_geojson: 'Available in payload',
          },
          outputs: {
            export_formats: ['GeoJSON FeatureCollection', 'Cloud Optimized GeoTIFF', 'STAC Item'],
            render_ready: true,
          },
          rationale: 'Ground station output finalized with full spatial grounding.',
          architecture: 'Cartographic GeoJSON & GeoPackage Serializer',
          weights: 'satquery-core-serializer',
        }
      }
    ]
  },

  'joshimath-subsidence': {
    id: 'joshimath-subsidence',
    title: 'Joshimath Slump Creep & InSAR Ground Deformation',
    shortTitle: 'Joshimath Subsidence',
    locationName: 'Joshimath Valley, Chamoli District',
    stateCountry: 'Uttarakhand, India',
    initialQuery: 'Detect slope displacement and fault activation near Joshimath between 2022 and 2024',
    timestampUtc: '2024-03-22T08:15:40Z',
    coordinates: {
      lat: 30.5574,
      lon: 79.5658,
      utmZone: '44N',
      mgrs: '44RLL589781',
      bounds: {
        north: 30.590,
        south: 30.520,
        west: 79.530,
        east: 79.600,
      }
    },
    telemetry: {
      gsd: '0.28m (Cartosat-3 PAN) / 5.0m (Sentinel-1 InSAR)',
      sunElevation: '46.1°',
      satelliteAzimuth: '148.5°',
      sensorIncidence: '34.8°',
      constellation: ['Cartosat-3', 'Sentinel-1B (DInSAR)', 'RISAT-1A'],
      revisitCycle: '12 days (Repeat pass interferometry)',
    },
    preEvent: {
      date: '2022-11-10',
      label: 'Pre-Subsidence Optical Baseline (Cartosat-3)',
      satellite: 'ISRO Cartosat-3 PAN',
      sensor: 'High-Resolution Panchromatic (0.28m)',
      description: 'Pre-crisis stable slope geometry, building footprints, and intact highway road switchbacks.',
      layerType: 'optical_rgb',
    },
    postEvent: {
      date: '2024-03-18',
      label: 'DInSAR Differential Phase Velocity Map',
      satellite: 'Sentinel-1 InSAR Interferometry',
      sensor: 'C-Band Interferometric Wide Swath',
      description: 'Interferometric fringe displacement showing down-slope Line-of-Sight (LOS) deformation rate exceeding -68 mm/yr.',
      layerType: 'insar_deformation',
    },
    naturalAnswer: 'Differential Synthetic Aperture Radar Interferometry (DInSAR) multi-temporal SBAS analysis reveals concentrated slope subsidence along the Sunil and Manohar Bagh wards of Joshimath. Line-of-sight velocity deformation peaked at -72 mm/year, correlating with tension crack propagation across 82 hectares of glacial moraine deposits. Auli Ropeway Tower #1 foundation demonstrates 14.2 mm horizontal shear displacement.',
    keyMetrics: [
      {
        label: 'Peak Subsidence Velocity',
        value: '-72',
        unit: 'mm/year',
        change: 'LOS velocity acceleration',
        severity: 'critical',
      },
      {
        label: 'High Deformation Zone',
        value: '82.4',
        unit: 'ha',
        change: 'Sunil & Manohar Bagh',
        severity: 'critical',
      },
      {
        label: 'Interferometric Coherence',
        value: '0.78',
        unit: 'gamma (γ)',
        change: 'Sufficient for phase unwrapping',
        severity: 'normal',
      },
      {
        label: 'Infra Structures at Risk',
        value: '264',
        unit: 'buildings',
        change: 'Enclosed in scarp polygon',
        severity: 'warning',
      }
    ],
    groundingFeatures: [
      {
        id: 'gf-jm-1',
        label: 'Sunil Ward Main Slump Zone',
        category: 'ground_deformation',
        confidence: 0.974,
        areaHectares: 48,
        color: '#f43f5e',
        points: [
          [35, 30], [55, 28], [62, 45], [48, 55], [32, 44]
        ],
        bbox: [32, 28, 62, 55],
        telemetry: {
          displacementRateMmYr: '-72 mm/year (LOS)',
          sensorCoherence: 0.82,
        }
      },
      {
        id: 'gf-jm-2',
        label: 'Marwari Scarp Crown & Tension Cracks',
        category: 'infrastructure_risk',
        confidence: 0.941,
        areaHectares: 22,
        color: '#f97316',
        points: [
          [58, 48], [76, 44], [80, 58], [64, 62]
        ],
        bbox: [58, 44, 80, 62],
        telemetry: {
          displacementRateMmYr: '-48 mm/year',
          sensorCoherence: 0.74,
        }
      },
      {
        id: 'gf-jm-3',
        label: 'Auli Ropeway Tower #1 Foundation Shear',
        category: 'infrastructure_risk',
        confidence: 0.925,
        areaHectares: 12,
        color: '#eab308',
        points: [
          [28, 58], [38, 56], [40, 66], [30, 68]
        ],
        bbox: [28, 56, 40, 68],
        telemetry: {
          displacementRateMmYr: '-38 mm/year (Shear vector)',
          sensorCoherence: 0.88,
        }
      }
    ],
    dagNodes: [
      {
        id: 'node-jm-1',
        stepNumber: 1,
        title: 'Query Parser & Himalayan Toponym Match',
        specialistModel: 'SAC Mountain Hazards Gazeteer',
        status: 'completed',
        latencyMs: 128,
        confidence: 0.995,
        category: 'ingest',
        summary: 'Identified Joshimath town, steep relief, high-altitude slope creep task.',
        details: {
          inputs: { raw_text: 'Detect slope displacement and fault activation near Joshimath between 2022 and 2024' },
          outputs: { aoi_bbox: [79.53, 30.52, 79.60, 30.59], crs: 'EPSG:32644 (UTM Zone 44N)' },
          rationale: 'Himalayan terrain requires InSAR interferometry over optical RGB.',
          architecture: 'Transformer NER + Spatial Indexing',
          weights: 'sac-himalaya-hazards-v1',
        }
      },
      {
        id: 'node-jm-2',
        stepNumber: 2,
        title: 'Multi-Temporal InSAR Stack Selection',
        specialistModel: 'ISRO Bhoonidhi SAR Interceptor',
        status: 'completed',
        latencyMs: 340,
        confidence: 0.982,
        category: 'ingest',
        summary: 'Selected 28 Sentinel-1 ascending passes. Baseline perpendicular < 85m.',
        details: {
          inputs: { pass_type: 'Ascending Orbit 42', temporal_baseline: '12-day pairs' },
          outputs: { interferograms_formed: 46, average_coherence: 0.76 },
          rationale: 'Ascending orbit provides optimal look angle against west-facing Joshimath slope.',
          architecture: 'SBAS Small Baseline Subset Optimization',
          weights: 'sbas-processor-v4',
        }
      },
      {
        id: 'node-jm-3',
        stepNumber: 3,
        title: '2D Phase Unwrapping & Topographic Removal',
        specialistModel: 'SNAPHU High-Coherence Phase Unwrapper',
        status: 'completed',
        latencyMs: 590,
        confidence: 0.961,
        category: 'alignment',
        summary: 'Stripped 30m TanDEM-X topographic phase. Minimum Cost Flow unwrapping converged at 99.1%.',
        details: {
          inputs: { unwrapping_algorithm: 'Statistical-Cost Network Flow (SNAPHU)' },
          outputs: { unwrapped_phase_radians: '[-14.2 to +3.8 rad]', phase_to_disp_scale: '0.028m/cycle' },
          rationale: 'Steep relief induces geometric phase ramps; TanDEM-X eliminates false topographic displacement.',
          architecture: 'Network Flow Dynamic Optimization',
          weights: 'snaphu-cuda-v2',
        }
      },
      {
        id: 'node-jm-4',
        stepNumber: 4,
        title: 'SBAS Time-Series Inversion & Velocity Calc',
        specialistModel: 'ISRO DInSAR Time-Series Deformer',
        status: 'completed',
        latencyMs: 460,
        confidence: 0.970,
        category: 'spectroradiometry',
        summary: 'Calculated mean LOS velocity. Detected peak deformation of -72 mm/year at Sunil Ward.',
        details: {
          inputs: { reference_point: 'Stable bedrock GPS station at Auli plateau' },
          outputs: { max_deformation: '-72 mm/yr', total_los_displacement: '-148 mm' },
          rationale: 'Atmospheric phase screen (APS) filtered using spatio-temporal low-pass/high-pass filters.',
          architecture: 'Singular Value Decomposition (SVD) Matrix Inverter',
          weights: 'sbas-inversion-cuda',
        }
      },
      {
        id: 'node-jm-5',
        stepNumber: 5,
        title: 'Cartosat-3 Crack Feature Detection',
        specialistModel: 'ISRO High-Res GeoSegmenter (0.28m)',
        status: 'completed',
        latencyMs: 510,
        confidence: 0.938,
        category: 'segmentation',
        summary: 'Matched InSAR deformation hotspot with sub-meter tension cracks in building foundations.',
        details: {
          inputs: { pan_resolution: '0.28m', texture_gradients: 'Sobel + Canny Edge Mask' },
          outputs: { detected_surface_cracks: 18, highway_fracture_length: '320m' },
          rationale: 'Fusing SAR deformation rate with Cartosat-3 sub-meter optical validates structural compromise.',
          architecture: 'Convolutional Deep Edge Feature Pyramid',
          weights: 'isro-cartosat-structural-net',
        }
      },
      {
        id: 'node-jm-6',
        stepNumber: 6,
        title: 'Disaster Hazard Risk Synthesis',
        specialistModel: 'SAC Disaster Management Support System',
        status: 'completed',
        latencyMs: 110,
        confidence: 0.991,
        category: 'synthesis',
        summary: 'Synthesized hazard zone contours, building risk counts, and evacuation telemetry.',
        details: {
          inputs: { risk_buffer: '100m fault perimeter' },
          outputs: { priority_evacuation_structures: 264, emergency_route_alert: 'Badrinath highway clearance' },
          rationale: 'Immediate spatial grounding for district magistrate and NDRF dispatch.',
          architecture: 'GIS Hazard Decision Engine',
          weights: 'dmsp-isro-v2',
        }
      }
    ]
  },

  'sundarbans-erosion': {
    id: 'sundarbans-erosion',
    title: 'Sundarbans Mangrove Dieback & Cyclone Erosion',
    shortTitle: 'Sundarbans Shoreline',
    locationName: 'Ghoramara & Sundarbans Biosphere',
    stateCountry: 'West Bengal, India',
    initialQuery: 'What changed in Sundarbans mangrove fringe after the recent cyclone landfall?',
    timestampUtc: '2024-06-08T10:20:12Z',
    coordinates: {
      lat: 21.9214,
      lon: 88.0825,
      utmZone: '45N',
      mgrs: '45QTY081249',
      bounds: {
        north: 22.100,
        south: 21.750,
        west: 87.900,
        east: 88.250,
      }
    },
    telemetry: {
      gsd: '10.0m (Sentinel-2 MSI) / 20.0m (Sentinel-1 SAR)',
      sunElevation: '66.2°',
      satelliteAzimuth: '115.8°',
      sensorIncidence: '32.1°',
      constellation: ['Sentinel-2A', 'Resourcesat-2A (LISS-IV)', 'Sentinel-1A'],
      revisitCycle: '5 days',
    },
    preEvent: {
      date: '2024-04-10',
      label: 'Pre-Cyclone Healthy Mangrove Canopy (NDVI)',
      satellite: 'Sentinel-2A MSI',
      sensor: 'Normalized Difference Vegetation Index',
      description: 'Dense Avicennia & Rhizophora mangrove canopy, stabilized barrier sandbanks, continuous shoreline.',
      layerType: 'ndvi_canopy',
    },
    postEvent: {
      date: '2024-06-02',
      label: 'Post-Cyclone Tidal Surge & Canopy Defoliation',
      satellite: 'Sentinel-2A + Sentinel-1 SAR',
      sensor: 'Bi-Temporal NDVI Difference (ΔNDVI)',
      description: 'Severe canopy stripping from 140 km/h gusts and saltwater storm surge inundation breaching mud embankments.',
      layerType: 'cyclone_surge',
    },
    naturalAnswer: 'Bi-temporal analysis across the Sundarbans coastal delta identifies 920 hectares of severe mangrove canopy dieback (ΔNDVI < -0.38) and 140 meters of westward shoreline retreat on Ghoramara Island. High-velocity tidal surge breached earthen bunds at Matla estuary, flooding 1,840 hectares of inland agricultural polders with hyper-saline water.',
    keyMetrics: [
      {
        label: 'Canopy Loss Area',
        value: '920',
        unit: 'ha',
        change: 'ΔNDVI < -0.38 defoliation',
        severity: 'critical',
      },
      {
        label: 'Shoreline Retreat',
        value: '-140',
        unit: 'm',
        change: 'Western Ghoramara bank',
        severity: 'critical',
      },
      {
        label: 'Saline Inundated Polders',
        value: '1,840',
        unit: 'ha',
        change: 'Embankment breached',
        severity: 'warning',
      },
      {
        label: 'Sediment Plume Turbidity',
        value: '+215%',
        unit: 'NTU',
        change: 'Estuarine runoff',
        severity: 'normal',
      }
    ],
    groundingFeatures: [
      {
        id: 'gf-sb-1',
        label: 'Ghoramara Island Western Shoreline Retreat',
        category: 'embankment_breach',
        confidence: 0.961,
        areaHectares: 280,
        color: '#f43f5e',
        points: [
          [20, 35], [38, 28], [42, 48], [30, 62], [18, 54]
        ],
        bbox: [18, 28, 42, 62],
        telemetry: {
          vegetationLossPct: '88% stripped',
          waterDepthEstimate: '2.8m tidal crest',
        }
      },
      {
        id: 'gf-sb-2',
        label: 'Jambudwip Mangrove Canopy Dieback Zone',
        category: 'canopy_loss',
        confidence: 0.945,
        areaHectares: 640,
        color: '#f97316',
        points: [
          [48, 55], [68, 48], [78, 65], [65, 78], [44, 72]
        ],
        bbox: [44, 48, 78, 78],
        telemetry: {
          vegetationLossPct: '64% defoliation',
          soilMoistureIndex: '0.99 (Saline saturation)',
        }
      }
    ],
    dagNodes: [
      {
        id: 'node-sb-1',
        stepNumber: 1,
        title: 'Query Parser & Deltaic Toponym Matching',
        specialistModel: 'SAC Coastal & Delta Geocoder',
        status: 'completed',
        latencyMs: 135,
        confidence: 0.990,
        category: 'ingest',
        summary: 'Parsed Sundarbans delta coordinates, cyclone impact and mangrove health intent.',
        details: {
          inputs: { raw_text: 'What changed in Sundarbans mangrove fringe after the recent cyclone landfall?' },
          outputs: { aoi_bbox: [87.90, 21.75, 88.25, 22.10], crs: 'EPSG:32645' },
          rationale: 'Identified coastal bio-reserve requiring multi-spectral NDVI + SAR inundation cross-check.',
          architecture: 'Bi-directional Spatial NER',
          weights: 'sac-coastal-gazetteer-v2',
        }
      },
      {
        id: 'node-sb-2',
        stepNumber: 2,
        title: 'Tide-Synchronized STAC Satellite Pairing',
        specialistModel: 'ISRO Bhoonidhi & Copernicus STAC',
        status: 'completed',
        latencyMs: 310,
        confidence: 0.975,
        category: 'ingest',
        summary: 'Synchronized low-tide satellite acquisitions to isolate storm surge from daily tidal fluctuations.',
        details: {
          inputs: { tide_gauge: 'Sagar Island tidal gauge < 1.2m' },
          outputs: { selected_pair: 'S2A 2024-04-10 (pre) vs S2A 2024-06-02 (post)' },
          rationale: 'Tidal synchronization prevents false shoreline erosion classification from normal high tide water.',
          architecture: 'Harmonic Tide-Matching Ingest Engine',
          weights: 'isro-tide-sync-v1.4',
        }
      },
      {
        id: 'node-sb-3',
        stepNumber: 3,
        title: 'Atmospheric BOA Correction & Water Masking',
        specialistModel: 'Sen2Cor L2A Radiative Transfer',
        status: 'completed',
        latencyMs: 420,
        confidence: 0.968,
        category: 'alignment',
        summary: 'Aerosol and sunglint correction applied. Modified NDWI isolated permanent deltaic channels.',
        details: {
          inputs: { aerosol_model: 'Maritime Tropical Coastal' },
          outputs: { boa_reflectance_accuracy: '0.015 SR', mndwi_threshold: '0.12' },
          rationale: 'Tropical marine haze corrected to ensure reliable NIR/Red reflectance ratios for NDVI.',
          architecture: 'Radiative Transfer Model (LUT 6S)',
          weights: 'sen2cor-2.11',
        }
      },
      {
        id: 'node-sb-4',
        stepNumber: 4,
        title: 'Differential NDVI & Canopy Stress Extraction',
        specialistModel: 'ISRO Bio-Forestry Spectroradiometer',
        status: 'completed',
        latencyMs: 245,
        confidence: 0.958,
        category: 'spectroradiometry',
        summary: 'Calculated ΔNDVI. 920 ha detected with extreme canopy loss (ΔNDVI < -0.38).',
        details: {
          inputs: { formula: 'ΔNDVI = NDVI_post - NDVI_pre' },
          outputs: { severe_loss_ha: 920, moderate_stress_ha: 1420 },
          rationale: 'Strong drop in Near-Infrared band (B8) corresponds directly to salt-spray defoliation.',
          architecture: 'Multi-Temporal Spectral Delta Classifier',
          weights: 'isro-mangrove-ndvi-v3',
        }
      },
      {
        id: 'node-sb-5',
        stepNumber: 5,
        title: 'Shoreline Vector Shift & Erosion Delineation',
        specialistModel: 'SAC Coastal Morpho-Dynamic Network',
        status: 'completed',
        latencyMs: 530,
        confidence: 0.942,
        category: 'segmentation',
        summary: 'Sub-pixel water-land boundary extraction identified -140m net shoreline retreat along Ghoramara.',
        details: {
          inputs: { edge_detection: 'Sub-pixel Modified Normalized Difference Water Index (MNDWI)' },
          outputs: { max_shoreline_retreat: '142 meters', eroded_land_area_ha: 280 },
          rationale: 'Soft mudflat sediment washed out by cyclone storm waves.',
          architecture: 'Sub-Pixel Contour Extraction & Vector Displacement',
          weights: 'sac-coast-morph-v2',
        }
      },
      {
        id: 'node-sb-6',
        stepNumber: 6,
        title: 'Multi-Modal Spatial Grounding Report',
        specialistModel: 'SatQuery Synthesis Engine',
        status: 'completed',
        latencyMs: 95,
        confidence: 0.998,
        category: 'synthesis',
        summary: 'Synthesized geo-referenced vector polygons, loss hectare accounting, and coastal alert telemetry.',
        details: {
          inputs: { final_review: 'All validation criteria met' },
          outputs: { report_id: 'SUNDAR-2024-CYC-0602', ready_for_dispatch: true },
          rationale: 'Mission trace completed with full spatial grounding.',
          architecture: 'Cartographic GeoJSON Generator',
          weights: 'satquery-core-serializer',
        }
      }
    ]
  }
};

export const INITIAL_QUERY_LOGS: QueryLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '14:42:18 UTC',
    queryText: 'Show me flooding near Kochi in the last month and identify impacted transport corridors',
    scenarioId: 'kochi-flood',
    status: 'resolved',
    sensorTags: ['SAR C-Band', 'Optical S2', 'SDWI'],
    aoiName: 'Kochi & Periyar Basin (Kerala)',
    confidenceScore: 0.968,
    summarySnippet: '4,625 ha inundation detected via Sentinel-1 SAR backscatter shift (Δσ⁰ < -5.4 dB). Aluva transport corridor cutoff confirmed.',
    executionTimeSec: 2.36,
    groundedFeatureCount: 4,
  },
  {
    id: 'log-002',
    timestamp: '08:15:40 UTC',
    queryText: 'Detect slope displacement and fault activation near Joshimath between 2022 and 2024',
    scenarioId: 'joshimath-subsidence',
    status: 'resolved',
    sensorTags: ['DInSAR', 'Cartosat-3', 'SBAS'],
    aoiName: 'Joshimath MCT Zone (Uttarakhand)',
    confidenceScore: 0.974,
    summarySnippet: 'DInSAR deformation rate peaked at -72 mm/year down-slope LOS velocity. 82.4 ha active slump creep in Sunil ward.',
    executionTimeSec: 2.14,
    groundedFeatureCount: 3,
  },
  {
    id: 'log-003',
    timestamp: '10:20:12 UTC',
    queryText: 'What changed in Sundarbans mangrove fringe after the recent cyclone landfall?',
    scenarioId: 'sundarbans-erosion',
    status: 'resolved',
    sensorTags: ['Optical S2', 'ΔNDVI', 'SAR'],
    aoiName: 'Sundarbans Delta (West Bengal)',
    confidenceScore: 0.958,
    summarySnippet: '920 ha severe mangrove canopy dieback (ΔNDVI < -0.38) and 140m shoreline retreat along Ghoramara Island.',
    executionTimeSec: 1.87,
    groundedFeatureCount: 2,
  }
];
