import { faChartPie, IconDefinition, faHospitalUser, faHome} from '@fortawesome/free-solid-svg-icons';


    export interface MenuItem {
      fontAwesomeIcon: IconDefinition; // Reemplaza con el ícono FontAwesome que desees
      buttonText: string;
      buttonDescription: string;
      routerlink: string;
    }
  
    export const items: MenuItem[] = [
      {
        fontAwesomeIcon: faHome, // Reemplaza con el ícono FontAwesome que desees
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
      // {
      //   fontAwesomeIcon: faHospitalUser,
      //   buttonText: 'Patients',
      //   buttonDescription: 'Ver pacientes',
      //   routerlink: '/students/historyClinic'
      // },
      

      
    ];
  