import { faChartPie, IconDefinition, faHospitalUser, faHome, faFileUpload} from '@fortawesome/free-solid-svg-icons';


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
        buttonDescription: 'Información del usuario',
        routerlink: '/students/dashboard'
      },
      {
        fontAwesomeIcon: faHospitalUser,
        buttonText: 'Pacientes',
        buttonDescription: 'Ver pacientes',
        routerlink: '/students/patients'
      },
      {
        fontAwesomeIcon: faFileUpload,
        buttonText: 'Cargar Pacientes',
        buttonDescription: 'Subir Excel de Alumnos.',
        routerlink: '/students/upload-patients'
      }
    ];
    
    export const AdminItems: MenuItem[] = [
      {
        fontAwesomeIcon: faHome,
        buttonText: 'Inicio',
        buttonDescription: 'Información del usuario',
        routerlink: '/admin/dashboard'
      },
      {
        fontAwesomeIcon: faHospitalUser,
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
        fontAwesomeIcon: faHospitalUser,
        buttonText: 'Nuevo administrador',
        buttonDescription: 'Insertar Administrador',
        routerlink: '/admin/addAdmin'
      },
      {
        fontAwesomeIcon: faFileUpload,
        buttonText: 'Cargar Alumnos',
        buttonDescription: 'Subir Excel de Alumnos.',
        routerlink: '/admin/upload-students'
      }
    ];
    
  