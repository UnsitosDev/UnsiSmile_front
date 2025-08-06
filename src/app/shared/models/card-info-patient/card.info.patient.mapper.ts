import { CardPatientView, PatientResponse } from "./card.info.patient";


export function mapToCardPatientView(data: PatientResponse): CardPatientView {
    const fullName = `${data.person.firstName} ${data.person.secondName} ${data.person.firstLastName} ${data.person.secondLastName}`;
    const birthDate = new Date(data.person.birthDate[0], data.person.birthDate[1] - 1, data.person.birthDate[2]);
    const admissionDate = new Date(data.admissionDate[0], data.admissionDate[1] - 1, data.admissionDate[2]);
    const address = `${data.address.street.name} #${data.address.streetNumber} Int. ${data.address.interiorNumber}, Col. ${data.address.street.neighborhood.name}, ${data.address.street.neighborhood.locality.name}, ${data.address.street.neighborhood.locality.municipality.state.name}`;

    return {
        fullName,
        gender: data.person.gender.gender,
        birthDate: formatDateDMY(birthDate),
        phone: data.person.phone,
        address,
        email: data.person.email,
        admissionDate: formatDateDMY(admissionDate),
        curp: data.person.curp,
        medicalRecord: data.medicalRecordNumber,
        hasTreatmentInProgress: data.hasTreatmentInProgress,
    };
}

function formatDateDMY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

