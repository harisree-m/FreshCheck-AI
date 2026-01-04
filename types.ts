
export enum FreshnessStatus {
  FRESH = 'Fresh',
  OKAY = 'Okay',
  AVOID = 'Avoid'
}

export interface AnalysisResult {
  status: FreshnessStatus;
  category: string;
  confidence: number;
  reasoning: string;
  shelfLife: string;
  storageTips: string[];
}

export interface AppState {
  image: string | null;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
