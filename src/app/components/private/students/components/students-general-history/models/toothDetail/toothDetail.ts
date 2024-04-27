import { dentalCodeRequest, dentalCodeResponse } from "../dentalCode/dentalCode"
import { odontogramRequest, odontogramResponse } from "../odontogram/odontogram"
import { toothConditionRequest, toothConditionResponse } from "../toothCondition/toothCondition"
import { toothRegionRequest, toothRegionResponse } from "../toothRegion/toothRegion"

export interface toothDetailRequest {

  "idToothDetail": number,
  "dentalCode": dentalCodeRequest,
  "toothConditionRequest": toothConditionRequest,
  "toothRegionRequest": toothRegionRequest,
  "odontogramRequest": odontogramRequest
}

export interface toothDetailResponse {

  "idToothDetail": number,
  "dentalCode": dentalCodeResponse,
  "toothCondition": toothConditionResponse,
  "toothRegion": toothRegionResponse,
  "odontogram": odontogramResponse

}