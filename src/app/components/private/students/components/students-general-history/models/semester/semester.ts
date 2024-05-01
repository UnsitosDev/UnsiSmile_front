import { careersRequest } from "../careers/careers"
import { cyclesResponse } from "../cycles/cycles"
import { groupRequest, groupResponse } from "../group/group"

export interface toothConditionRequest {
    "idSemester": number|null,
    "group": groupRequest,
    "cycle": careersRequest
}


export interface semesterResponse {
    "idSemester": number,
    "group": groupResponse,
    "cycle": cyclesResponse

}