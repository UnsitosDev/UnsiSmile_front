export interface studentRequest {

    "enrollment": "string",
    "user": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "username": "string",
        "role": {
            "idRole": 0,
            "role": "ROLE_ADMIN"
        }
    },
    "person": {
        "curp": "string",
        "firstName": "string",
        "secondName": "string",
        "firstLastName": "string",
        "secondLastName": "string",
        "phone": "string",
        "birthDate": "2024-04-30",
        "email": "string",
        "gender": {
            "idGender": 0,
            "gender": "string"
        }
    }


}

export interface studentResponse {

    "idCareer": 0,
    "career": "string"

}


export interface studentUserResponse {
    enrollment: string;
    user: {
      id: string;
      username: string;
      role: {
        idRole: number;
        role: string;
      };
    };
    person: {
      curp: string;
      firstName: string;
      secondName: string;
      firstLastName: string;
      secondLastName: string;
      phone: string;
      birthDate: number[];
      email: string;
      gender: {
        idGender: number;
        gender: string;
      };
    };
  }
  