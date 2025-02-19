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
        fontAwesomeIcon: faFileUpload,
        buttonText: 'Cargar Pacientes',
        buttonDescription: 'Subir Excel de Pacientes.',
        routerlink: '/students/upload-patients'
      }
    ];
    
    export const AdminItems: MenuItem[] = [
      {
        fontAwesomeIcon: faHome,
        buttonText: 'Inicio',
        buttonDescription: 'Información relevante',
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
        buttonText: 'Cargar Pacientes',
        buttonDescription: 'Subir Excel de Pacientes.',
        routerlink: '/admin/upload-patients'
      }
    ];

    export const TeacherItems: MenuItem[] = [
      {
        fontAwesomeIcon: faHome,
        buttonText: 'Inicio',
        buttonDescription: 'Información relevante',
        routerlink: '/teacher/dashboard'
      },
      {
        fontAwesomeIcon: faHospitalUser,
        buttonText: 'Estudiantes',
        buttonDescription: 'Ver estudiantes',
        routerlink: '/teacher/student'
      },
    ];
    
  