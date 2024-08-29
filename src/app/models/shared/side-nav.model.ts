import { faChartPie, IconDefinition, faHospitalUser, faHome} from '@fortawesome/free-solid-svg-icons';


    export interface MenuItem {
      fontAwesomeIcon: IconDefinition; // Reemplaza con el ícono FontAwesome que desees
      buttonText: string;
      buttonDescription: string;
      routerlink: string;
    }
  
    export const studentItems: MenuItem[] = [
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
    ];
    
    export const adminItems: MenuItem[] = [
      {
        fontAwesomeIcon: faHome,
        buttonText: 'Inicio',
        buttonDescription: 'Información del usuario',
        routerlink: '/admin'
      },
      {
        fontAwesomeIcon: faHospitalUser,
        buttonText: 'Estudiantes',
        buttonDescription: 'Ver estudiantes',
        routerlink: '/admin/students'
      },
      // Agregar mas dependiendo de sus vistas
    ];
    
  