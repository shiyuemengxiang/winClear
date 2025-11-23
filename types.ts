export interface CleanerOption {
  id: string;
  label: string;
  description: string;
  command: string;
  category: 'system' | 'network' | 'disk';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ScriptConfig {
  [key: string]: boolean;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
