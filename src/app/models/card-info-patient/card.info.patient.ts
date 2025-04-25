export interface Gender {
    idGender: number;
    gender: string;
}

export interface Person {
    curp: string;
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    phone: string;
    birthDate: [number, number, number];
    email: string;
    gender: Gender;
}

export interface State {
    idState: string;
    name: string;
}

export interface Municipality {
    idMunicipality: string;
    name: string;
    state: State;
}

export interface Locality {
    idLocality: number;
    name: string;
    postalCode: string;
    municipality: Municipality;
}

export interface Neighborhood {
    idNeighborhood: number;
    name: string;
    locality: Locality;
}

export interface Street {
    idStreet: number;
    name: string;
    neighborhood: Neighborhood;
}

export interface Housing {
    idHousing: string;
    category: string;
}

export interface Address {
    idAddress: number;
    streetNumber: string;
    interiorNumber: string;
    housing: Housing;
    street: Street;
}

export interface Nationality {
    idNationality: number;
    nationality: string;
}

export interface MaritalStatus {
    idMaritalStatus: number;
    maritalStatus: string;
}

export interface Occupation {
    idOccupation: number;
    occupation: string;
}

export interface EthnicGroup {
    idEthnicGroup: number;
    ethnicGroup: string;
}

export interface Religion {
    idReligion: number;
    religion: string;
}

export interface CardGuardian {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    parentalStatus: {
        idCatalogOption: number;
        optionName: string;
    };
    doctorName: string;
}

export interface PatientResponse {
    idPatient: string;
    admissionDate: [number, number, number];
    medicalRecordNumber: number;
    isMinor: boolean;
    hasDisability: boolean;
    nationality: Nationality;
    person: Person;
    address: Address;
    maritalStatus: MaritalStatus;
    occupation: Occupation;
    ethnicGroup: EthnicGroup;
    religion: Religion;
    guardian: CardGuardian | null;
    student: any;
}

// map

export interface CardPatientView {
    fullName: string;
    gender: string;
    birthDate: any;
    phone: string;
    address: any;
    email: string;
    admissionDate: any;
    curp: string;
}

export interface CardGuardianView {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    parentalStatus: {
        idCatalogOption: number;
        optionName: string;
    };
    doctorName: string;
}
