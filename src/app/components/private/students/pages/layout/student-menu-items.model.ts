import { faFileArchive, faFileClipboard, faHome, faHospitalUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "@mean/models";

// Menú para estudiantes
export const StudentItems: MenuItem[] = [
  {
    fontAwesomeIcon: faHome,
    buttonText: 'Inicio',
    buttonDescription: 'Información relevante',
    routerlink: '/students/dashboard',
  },
  {
    fontAwesomeIcon: faHospitalUser,
    buttonText: 'Pacientes',
    buttonDescription: 'Ver pacientes',
    routerlink: '/students/patients',
    children: [
      {
        fontAwesomeIcon: faPlus,
        buttonText: 'Nuevo paciente',
        buttonDescription: 'Registrar paciente',
        routerlink: '/students/patients/addPatient',
      },
    ],
  },
  {
    fontAwesomeIcon: faFileArchive,
    buttonText: 'Archivos',
    buttonDescription: 'Descargar archivos',
    routerlink: '/students/dowload-formats',
  },
  {
    fontAwesomeIcon: faFileClipboard,
    buttonText: 'Tratamientos',
    buttonDescription: 'Ver tratamientos',
    routerlink: '/students/all-treatments',
  },
];