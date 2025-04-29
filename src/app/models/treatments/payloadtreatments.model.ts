// En tu archivo payloadtreatments.model.ts
export interface RequestTreatment {
    idTreatmentDetail: number;
    patientId: string;
    treatmentId: number;
    startDate: string;  
    endDate: string;    
    professorId: string;
    status: string;
    treatmentDetailToothRequest: {
      idTreatmentDetail: number;
      idTeeth: string[];  
    }
  }
