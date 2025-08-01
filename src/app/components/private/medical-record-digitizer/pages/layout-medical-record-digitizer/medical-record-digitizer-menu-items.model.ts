import { faFileClipboard, faHome } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "@mean/models";

export const MedicalRecordDigitizerItems: MenuItem[] = [
  {
    fontAwesomeIcon: faHome,
    buttonText: 'Inicio',
    buttonDescription: 'Información relevante',
    routerlink: '/medical-record-digitizer/dashboard',
  },
  {
    fontAwesomeIcon: faFileClipboard,
    buttonText: 'Historias Clinicas',
    buttonDescription: 'Digitalizar historias clinicas',
    routerlink: '/medical-record-digitizer/patients',
  },
];