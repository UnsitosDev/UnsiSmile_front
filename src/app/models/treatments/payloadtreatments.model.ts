// En tu archivo payloadtreatments.model.ts
export interface RequestTreatment {
    idTreatmentDetail: number;
    patientId: string;
    treatmentId: number;
    startDate: string;  
    endDate: string;    
    treatmentDetailToothRequest: {
      idTreatmentDetail: number;
      idTeeth: string[];  
    }
  }
