import { housingMaterialRequest, housingMaterialResponse } from "../housingMaterial/housingMaterial"

export interface nonPathologicalPersonalAntecedentsRequest {
    "idNonPathologicalPersonalAntecedents": number,
    "eatsFruitsVegetables": boolean,
    "eatsMeat": boolean,
    "eatsCereals": boolean,
    "eatsJunkFood": boolean,
    "drinksWaterDaily": boolean,
    "drinksSodas": boolean,
    "dailySleepHours": number,
    "timesBathesPerWeek": number,
    "timesBrushesTeethPerDay": number,
    "houseWithFloor": boolean,
    "housingMaterialId": housingMaterialRequest
    }

export interface nonPathologicalPersonalAntecedentsResponse {
    "idNonPathologicalPersonalAntecedents": number,
    "eatsFruitsVegetables": boolean,
    "eatsMeat": boolean,
    "eatsCereals": boolean,
    "eatsJunkFood": boolean,
    "drinksWaterDaily": boolean,
    "drinksSodas": boolean,
    "dailySleepHours": number,
    "timesBathesPerWeek": number,
    "timesBrushesTeethPerDay": number,
    "houseWithFloor": boolean,
    "housingMaterial": housingMaterialResponse
}