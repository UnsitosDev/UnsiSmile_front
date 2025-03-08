export interface studentRequest {
    enrollment: string;
    user: {
        id: string;
        username: string;
        role: {
            idRole: number;
            role: string;
        };
        status: boolean;
        profilePictureId?: string;
    };
    person: {
        curp: string;
        firstName: string;
        secondName: string;
        firstLastName: string;
        secondLastName: string;
        phone: string;
        birthDate: string;
        email: string;
        gender: {
            idGender: number;
            gender: string;
        };
    };
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
      status: boolean;
      profilePictureId: string;
    };
    person: {
      curp: string;
      firstName: string;
      secondName: string;
      firstLastName: string;
      secondLastName: string;
      phone: string;
      birthDate: string;
      email: string;
      gender: {
        idGender: number;
        gender: string;
      };
    };
    group: {
      idGroup: number;
      groupName: string;
      semesterNumber: number;
      career: {
        idCareer: number;
        career: string;
      };
    };
    studentStatus: string;
  }
