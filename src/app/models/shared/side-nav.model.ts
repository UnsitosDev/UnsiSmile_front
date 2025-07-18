import {
  faChartPie,
  IconDefinition,
  faHospitalUser,
  faHome,
  faFileUpload,
  faUserGraduate,
  faUserShield,
  faFileArchive,
  faFileArrowDown,
  faFileClipboard,
  faPeace,
  faShopLock,
  faTasks,
  faCheck,
  faClose,
  faUsers,
  faClinicMedical,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

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
    buttonDescription: 'Descargar archivos',
    routerlink: '/students/dowload-formats'
  },
  {
    fontAwesomeIcon: faFileClipboard,
    buttonText: 'Tratamientos',
    buttonDescription: 'Ver tratamientos',
    routerlink: '/students/all-treatments'
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
          },
        ]
      },
      {
        fontAwesomeIcon: faUserShield,
        buttonText: 'Encargados de area clínica ',
        buttonDescription: 'Ver encargados de area',
        routerlink: '/admin/clinical-area',
      },
    ]
  },
  {
    fontAwesomeIcon: faUserShield,
    buttonText: 'Pacientes',
    buttonDescription: 'Gestión de pacientes',
    routerlink: '/admin/patients',
    children: [
      {
        fontAwesomeIcon: faPlus,
        buttonText: 'Nuevo paciente',
        buttonDescription: 'Registrar paciente',
        routerlink: '/admin/patients/addPatient'
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
    buttonDescription: 'Subir excel de alumnos',
    routerlink: '/admin/upload-students'
  },
  {
    fontAwesomeIcon: faFileUpload,
    buttonText: 'Carga de archivos',
    buttonDescription: 'Subir archivos',
    routerlink: '/admin/upload-files'
  },
  {
    fontAwesomeIcon: faFileClipboard,
    buttonText: 'Tratamientos',
    buttonDescription: 'Reportes de tratamientos',
    routerlink: '/admin/treatments',
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
  },
  {
    fontAwesomeIcon: faFileClipboard,
    buttonText: 'Tratamientos',
    buttonDescription: 'Revisar Tratamientos',
    routerlink: '/clinical-area-supervisor/review-treatment'
  },
  {
    fontAwesomeIcon: faFileClipboard,
    buttonText: 'Tratamientos en espera',
    buttonDescription: 'Aprobar tratamientos en espera',
    routerlink: '/clinical-area-supervisor/approval-treatments'
  }
];

export const MedicalRecordDigitizerItems: MenuItem[] = [
    {
      fontAwesomeIcon: faHome,
      buttonText: 'Inicio',
      buttonDescription: 'Información relevante',
      routerlink: '/medical-record-digitizer/dashboard'
    },
    {
      fontAwesomeIcon: faFileClipboard,
      buttonText: 'Historias Clinicas',
      buttonDescription: 'Digitalizar historias clinicas',
      routerlink: '/medical-record-digitizer/history-clinics'
    },
  ];

