export interface AdminResponse {
    employeeNumber: string;
    person:         Person;
    user:           User;
}

export interface Person {
    curp:           string;
    firstName:      string;
    secondName:     string;
    firstLastName:  string;
    secondLastName: string;
    phone:          string;
    birthDate:      Date;
    email:          string;
    gender:         Gender;
}

export interface Gender {
    idGender: number;
    gender:   string;
}

export interface User {
    id:       string;
    username: string;
    role:     Role;
    status:   boolean;
}

export interface Role {
    idRole: number;
    role:   string;
}
