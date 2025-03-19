import { faChartPie, IconDefinition, faHospitalUser, faHome, faFileUpload, faUserGraduate, faUserShield, faFileArchive, faFileArrowDown, faFileClipboard} from '@fortawesome/free-solid-svg-icons';


    export interface MenuItem {
      fontAwesomeIcon: IconDefinition; // Reemplaza con el ícono FontAwesome que desees
      buttonText: string;
      buttonDescription: string;
      routerlink: string;
    }
  
    

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
        routerlink: '/students/patients'
      },
      {
        fontAwesomeIcon: faFileArchive,
        buttonText: 'Formatos',
        buttonDescription: 'Descargar formatos',
        routerlink: '/students/dowload-formats'
      },
    ];
    
    export const AdminItems: MenuItem[] = [
      {
        fontAwesomeIcon: faHome,
        buttonText: 'Inicio',
        buttonDescription: 'Información relevante',
        routerlink: '/admin/dashboard'
      },
      {
        fontAwesomeIcon: faUserGraduate,
        buttonText: 'Estudiantes',
        buttonDescription: 'Ver estudiantes',
        routerlink: '/admin/students'
      },
      {
        fontAwesomeIcon: faHospitalUser,
        buttonText: 'Pacientes',
        buttonDescription: 'Ver pacientes',
        routerlink: '/admin/patients'
      },
      {
        fontAwesomeIcon: faUserShield,
        buttonText: 'Administrador',
        buttonDescription: 'Ver administradores',
        routerlink: '/admin/admins'
      },
      {
        fontAwesomeIcon: faFileUpload,
        buttonText: 'Cargar Alumnos',
        buttonDescription: 'Subir Excel de Alumnos.',
        routerlink: '/admin/upload-students'
      },
      {
        fontAwesomeIcon: faFileUpload,
        buttonText: 'Cargar Formatos',
        buttonDescription: 'Subir Formatos',
        routerlink: '/admin/upload-files'
      },
    ];

    export const ProfessorItems: MenuItem[] = [
      {
        fontAwesomeIcon: faHome,
        buttonText: 'Inicio',
        buttonDescription: 'Información relevante',
        routerlink: '/professor/dashboard'
      },
      {
        fontAwesomeIcon: faHospitalUser,
        buttonText: 'Estudiantes',
        buttonDescription: 'Ver estudiantes',
        routerlink: '/professor/students'
      },
      {
        fontAwesomeIcon: faFileClipboard,
        buttonText: 'Historias Clinicas',
        buttonDescription: 'Revisar Historias Clinicas',
        routerlink: '/professor/history-clinics'
      }
    ];
    
  