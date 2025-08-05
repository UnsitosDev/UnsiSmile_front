interface Treatments {
  resins: number;
  prophylaxis: number;
  fluorosis: number;
  pitAndFissureSealers: number;
  extractions: number;
  prosthesisRemovable: number;
  removableProsthesis: number;
  prosthodontics: number;
  rootCanals: number;
  scrapedAndSmoothed: number;
  closedAndOpen: number;
  distalWedges: number;
  pulpotomyAndCrowns: number;
  pulpectomyAndCrowns: number;
}

interface PatientsByNationality {
  [nationality: string]: number;
}

export interface PatientStatistics {
  totalPatients: number;
  patientsWithDisability: number;
  patientsRegisteredLastMonth: number;
  patientsByNationality: PatientsByNationality;
  patientsUnder18: number;
  patientsBetween18And60: number;
  patientsOver60: number;
  treatments: Treatments;
  rejectedTreatments: number;
  progressingTreatments: number;
  inReviewTreatments: number;
}

export const TREATMENT_TRANSLATIONS: Record<keyof Treatments, string> = {
  resins: 'Resinas',
  prophylaxis: 'Profilaxis',
  fluorosis: 'Fluorosis',
  pitAndFissureSealers: 'Selladores de Fosas y Fisuras',
  extractions: 'Extracciones',
  prosthesisRemovable: 'Prótesis Removible',
  removableProsthesis: 'Prótesis Removible',
  prosthodontics: 'Prostodoncia',
  rootCanals: 'Endodoncias',
  scrapedAndSmoothed: 'Raspado y Alisado',
  closedAndOpen: 'Cerrado y Abierto',
  distalWedges: 'Cuñas Distales',
  pulpotomyAndCrowns: 'Pulpotomía y Coronas',
  pulpectomyAndCrowns: 'Pulpectomía y Coronas'
};

export function mapTreatmentsToSpanish(treatments: Treatments): Record<string, number> {
  const mappedTreatments: Record<string, number> = {};
  
  Object.entries(treatments).forEach(([key, value]) => {
    const spanishKey = TREATMENT_TRANSLATIONS[key as keyof Treatments];
    mappedTreatments[spanishKey] = value;
  });
  
  return mappedTreatments;
}
