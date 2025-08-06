import { dentalCodeRequest, dentalCodeResponse } from "../dentalCode/dentalCode"
import { periodontogramaRequest, periodontogramaResponse } from "../periodontograma/periodontograma"
import { regionMeasurementPocketsRequest, regionMeasurementPocketsResponse } from "../regionMeasurementPockets/regionMeasurementPockets"
import { toothRegionPeriodontogramRequest, toothRegionPeriodontogramResponse } from "../toothRegionPeriodontogram/toothRegionPeriodontogram"

export interface pocketMeasurementDetailRequest {
    "idPocketMeasurementDetail": number|null,
  "measurement": number,
  "toothRegionsPeriodontogram": toothRegionPeriodontogramRequest,
  "dentalCode": dentalCodeRequest,
  "regionsMeasurementPockets": regionMeasurementPocketsRequest,
  "periodontogram": periodontogramaRequest

}

export interface pocketMeasurementDetailResponse {
    "idPocketMeasurementDetail": number,
    "measurement": number,
    "toothRegionsPeriodontogram": toothRegionPeriodontogramResponse,
    "dentalCode": dentalCodeResponse,
    "regionsMeasurementPockets": regionMeasurementPocketsResponse,
    "periodontogram": periodontogramaResponse

}