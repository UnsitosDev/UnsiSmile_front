import {
  IconDefinition
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
