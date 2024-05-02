import { odontogramRequest } from "src/app/components/private/students/components/students-general-history/models/odontogram/odontogram"
import { vitalSignRequest } from "../vitalSigns/vitalSign"
import { nonPathologicalPersonalAntecedentsRequest } from "src/app/components/private/students/components/students-general-history/models/nonPathologicalPersonalAntecedents/nonPathologicalPersonalAntecedents"
import { facialExamRequest } from "src/app/components/private/students/components/students-general-history/models/facialExam/facialExam"

export interface medicalHistoryRequest {

    "idMedicalHistory": number | null,
    "patient": number,
    "facialExam": facialExamRequest,
    "nonPathologicalPersonalAntecedents": nonPathologicalPersonalAntecedentsRequest,
    "initialOdontogram": odontogramRequest,
    "finalOdontogram": odontogramRequest,
    "vitalSigns": vitalSignRequest

}


export interface medicalHistoryResponse {

    "idMedicalHistory": number,
    "facialExamId": number,
    "familyHistoryId": number,
    "nonPathologicalPersonalAntecedentsId": number,
    "initialOdontogramId": number,
    "finalOdontogramId": number,
    "vitalSignsId": number
}