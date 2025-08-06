export interface vitalSignRequest {

    "idVitalSigns": number|null,
    "weight": number,
    "height": number,
    "temperature": number,
    "heartRate": number,
    "respiratoryRate": number,
    "bloodPressure": number,
    "oxygenSaturation": number,
    "glucose": number,
    "pulse": number,
    "patientId": number
  
  }
  
  
  export interface vitalSignResponse {
  
    "idVitalSigns": number,
    "weight": number,
    "height": number,
    "temperature": number,
    "heartRate": number,
    "respiratoryRate": number,
    "bloodPressure": number,
    "oxygenSaturation": number,
    "glucose": number,
    "pulse": number
  }