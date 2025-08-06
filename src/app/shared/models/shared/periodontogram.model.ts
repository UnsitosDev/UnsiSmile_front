export interface Row {
  label: string;
  values: any;
  symbol: string;
}

export interface TabStructure {
  upperVestibular: TabSection;
  lowerPalatino: TabSection;
  upperLingual: TabSection;
  lowerVestibular: TabSection;
}

export interface TabSection {
  title: string;
  id: number;
  columns: number[];
  rows: Row[];
}

export interface SurfaceMeasurement {
  id?: number; 
  toothPosition: string;
  pocketDepth: number;
  lesionLevel: number;
  plaque: boolean;
  bleeding: boolean;
  calculus: boolean;
}

export interface SurfaceEvaluation {
  id?: number; 
  surface: string;
  surfaceMeasurements: SurfaceMeasurement[];
}

export interface ToothEvaluation {
  id?: number; 
  idTooth: string;
  mobility: number;
  surfaceEvaluations: SurfaceEvaluation[];
}

export interface PatientEvaluation {
  id?: number; 
  idQuestion?: number;
  patientId: string;
  plaqueIndex: number;
  bleedingIndex: number;
  evaluationDate: number[]; 
  notes: string;
  toothEvaluations: ToothEvaluation[];
}
