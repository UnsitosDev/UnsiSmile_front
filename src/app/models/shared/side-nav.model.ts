import { faChartPie, IconDefinition, faHospitalUser} from '@fortawesome/free-solid-svg-icons';


    export interface MenuItem {
      fontAwesomeIcon: IconDefinition; // Reemplaza con el ícono FontAwesome que desees
      buttonText: string;
      buttonDescription: string;
      routerlink: string;
    }
  
    export const items: MenuItem[] = [
      {
        fontAwesomeIcon: faChartPie, // Reemplaza con el ícono FontAwesome que desees
        buttonText: 'Dashboard',
        buttonDescription: 'Ver opciones del dashboard',
        routerlink: '/students/dashboard'
      },
      {
        fontAwesomeIcon: faHospitalUser,
        buttonText: 'Patients',
        buttonDescription: 'Ver pacientes',
        routerlink: '/students/patients'
      },
      
    ];
  