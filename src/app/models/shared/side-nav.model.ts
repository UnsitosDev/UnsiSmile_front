import { faChartPie, IconDefinition, faHospitalUser, faHome, faFileUpload, faUserGraduate, faUserShield, faFileArchive, faFileArrowDown, faFileClipboard, faPeace, faShopLock, faTasks, faCheck, faClose, faUsers, faClinicMedical, faPlus } from '@fortawesome/free-solid-svg-icons';

// Nueva interfaz con children
export interface MenuItem {
  fontAwesomeIcon: IconDefinition;
  buttonText: string;
  buttonDescription: string;
  routerlink: string;
  children?: MenuItem[];
  expanded?: boolean; // <-- Agregado para evitar el error de indexación
}

// Menú para estudiantes
export const StudentItems: MenuItem[] = [
  {
    fontAwesomeIcon: faHome,
    buttonText: 'Inicio',
    buttonDescription: 'Información relevante',
    routerlink: '/students/dashboard'
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
        routerlink: '/students/patients/addPatient'
      }
    ]
  },
  {
    fontAwesomeIcon: faFileArchive,
    buttonText: 'Archivos',
    buttonDescription: 'Descargar formatos',
    routerlink: '/students/dowload-formats'
  }
];

// Menú para administradores
export const AdminItems: MenuItem[] = [
  {
    fontAwesomeIcon: faHome,
    buttonText: 'Inicio',
    buttonDescription: 'Inicio',
    routerlink: '/admin/dashboard'
  },
  {
    fontAwesomeIcon: faUsers,
    buttonText: 'Usuarios',
    buttonDescription: 'Gestión de usuarios',
    routerlink: '#',
    children: [
      {
        fontAwesomeIcon: faUserGraduate,
        buttonText: 'Estudiantes',
        buttonDescription: 'Ver estudiantes',
        routerlink: '/admin/students',
        children: [
          {
            fontAwesomeIcon: faPlus,
            buttonText: 'Nuevo estudiante',
            buttonDescription: 'Registrar estudiante',
            routerlink: '/admin/students/addStudent'
          }
        ]
      },
      {
        fontAwesomeIcon: faFileUpload,
        buttonText: 'Profesores',
        buttonDescription: 'Ver profesores',
        routerlink: '/admin/professors',
        children: [
          {
            fontAwesomeIcon: faPlus,
            buttonText: 'Nuevo profesor',
            buttonDescription: 'Registrar profesor',
            routerlink: '/admin/professors/addProfessor'
          }
        ]
      },
      {
        fontAwesomeIcon: faUserShield,
        buttonText: 'Administradores',
        buttonDescription: 'Ver administradores',
        routerlink: '/admin/admins',
        children: [
          {
            fontAwesomeIcon: faPlus,
            buttonText: 'Nuevo administrador',
            buttonDescription: 'Registrar administrador',
            routerlink: '/admin/admins/addAdmin'
          }
        ]
      }
    ]
  },
  {
    fontAwesomeIcon: faClinicMedical,
    buttonText: 'Áreas clínicas',
    buttonDescription: 'Ver áreas clínicas',
    routerlink: '/admin/areas',
    children: [
      {
        fontAwesomeIcon: faPlus,
        buttonText: 'Nueva área clínica',
        buttonDescription: 'Crear nueva área clínica',
        routerlink: '/admin/create-area'
      }
    ]
  },
  {
    fontAwesomeIcon: faFileUpload,
    buttonText: 'Carga de alumnos',
    buttonDescription: 'Subir Excel de alumnos',
    routerlink: '/admin/upload-students'
  },
  {
    fontAwesomeIcon: faFileUpload,
    buttonText: 'Carga de archivos',
    buttonDescription: 'Subir formatos',
    routerlink: '/admin/upload-files'
  }
];

// Menú para profesores
export const ProfessorItems: MenuItem[] = [
  {
    fontAwesomeIcon: faHome,
    buttonText: 'Inicio',
    buttonDescription: 'Información relevante',
    routerlink: '/professor/dashboard'
  },
  {
    fontAwesomeIcon: faUserGraduate,
    buttonText: 'Estudiantes',
    buttonDescription: 'Ver estudiantes',
    routerlink: '/professor/students'
  }
];

export const ProfessorClinicalAlreaItems: MenuItem[] = [
  {
    fontAwesomeIcon: faHome,
    buttonText: 'Inicio',
    buttonDescription: 'Información relevante',
    routerlink: '/clinical-area-supervisor/dashboard'
  },
  {
    fontAwesomeIcon: faFileClipboard,
    buttonText: 'Historias Clinicas',
    buttonDescription: 'Revisar Historias Clinicas',
    routerlink: '/clinical-area-supervisor/history-clinics'
  }
];

