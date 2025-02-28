export interface StatusClinicalHistoryResponse {
    idStatusClinicalHistory: number; // Tipo number para el ID
    status: string; // Tipo string para el estado
    message: string; // Tipo string para el mensaje
    idPatientClinicalHistory: number; // Tipo number para el ID del historial clínico del paciente
}