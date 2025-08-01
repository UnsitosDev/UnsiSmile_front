import { faHome, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "@mean/models";

// Menú para profesores
export const ProfessorItems: MenuItem[] = [
    {
      fontAwesomeIcon: faHome,
      buttonText: 'Inicio',
      buttonDescription: 'Información relevante',
      routerlink: '/professor/dashboard',
    },
    {
      fontAwesomeIcon: faUserGraduate,
      buttonText: 'Estudiantes',
      buttonDescription: 'Ver estudiantes',
      routerlink: '/professor/students',
    },
  ];