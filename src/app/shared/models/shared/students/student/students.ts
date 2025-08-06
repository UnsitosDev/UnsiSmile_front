import { personRequest } from "src/app/shared/models/models-students/person/person"
import { userRequest } from "../User/user"


export interface studentsRequest{

    enrollment: string,
    user: userRequest,
    person: personRequest

}

export interface studentsResponse{

  enrollment: string,
  user: userRequest,
  person: personRequest

}
