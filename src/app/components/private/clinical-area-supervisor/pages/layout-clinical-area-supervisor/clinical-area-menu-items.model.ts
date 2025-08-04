import { faFileClipboard, faHome } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "@mean/models";

export const ClinicalAreaSupervisorsItems: MenuItem[] = [
    {
      fontAwesomeIcon: faHome,
      buttonText: 'Inicio',
      buttonDescription: 'Información relevante',
      routerlink: '/clinical-area-supervisor/dashboard',
    },
    {
      fontAwesomeIcon: faFileClipboard,
      buttonText: 'Tratamientos',
      buttonDescription: 'Revisar Tratamientos',
      routerlink: '/clinical-area-supervisor/review-treatment',
    },
    {
      fontAwesomeIcon: faFileClipboard,
      buttonText: 'Autorizar tratamientos',
      buttonDescription: 'Autorizar tratamientos en espera',
      routerlink: '/clinical-area-supervisor/approval-treatments',
    },
  ];