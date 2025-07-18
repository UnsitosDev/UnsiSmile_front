// Base interfaces
export interface Gender {
  idGender: number;
  gender: string;
}

export interface Role {
  idRole: number;
  role: string;
}

export interface Person {
  curp: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  phone: string;
  birthDate: number[];
  email: string;
  gender: Gender;
}

export interface User {
  id: string;
  username: string;
  role: Role;
  status: boolean;
  profilePictureId: string | null;
}

// Response interface
export interface ProfileResponse {
  id: string;
  username: string;
  role: Role;
  status: boolean;
  profilePictureId: string;
  profilePictureUrl: string;
}

// Specific profile interfaces
export interface AdminProfile {
  employeeNumber: string;
  person: Person;
  user: User;
  administratorStatus: string;
}

export interface StudentProfile {
  enrollment: string;
  person: Person;
  user: User;
  group: null;
  studentStatus: string;
}

export interface ProfessorProfile {
  employeeNumber: string;
  person: Person;
  user: User;
}
