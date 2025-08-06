import { faClinicMedical, faFileClipboard, faFileUpload, faHome, faPlus, faUserGraduate, faUsers, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "src/app/shared/models";

// Menú para administradores
export const AdminItems: MenuItem[] = [
    {
      fontAwesomeIcon: faHome,
      buttonText: 'Inicio',
      buttonDescription: 'Inicio',
      routerlink: '/admin/dashboard',
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
              routerlink: '/admin/students/addStudent',
            },
          ],
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
              routerlink: '/admin/professors/addProfessor',
            },
          ],
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
              routerlink: '/admin/admins/addAdmin',
            },
          ],
        },
        {
          fontAwesomeIcon: faUserShield,
          buttonText: 'Administradores clinicos',
          buttonDescription: 'Ver administradores clinicos',
          routerlink: '/admin/medical-admin',
          children: [
            {
              fontAwesomeIcon: faPlus,
              buttonText: 'Nuevo administrador',
              buttonDescription: 'Registrar administrador',
              routerlink: '/admin/admins/medical-admin/addMedicalAdmin',
            },
          ],
        },
        {
          fontAwesomeIcon: faUserShield,
          buttonText: 'Capturadores',
          buttonDescription: 'Ver capturadores',
          routerlink: '/admin/digitizers',
          children: [
            {
              fontAwesomeIcon: faPlus,
              buttonText: 'Nuevo capturador',
              buttonDescription: 'Registrar capturador',
              routerlink: '/admin/digitizers/addDigitizer',
            },
          ],
        },
        {
          fontAwesomeIcon: faUserShield,
          buttonText: 'Encargados de area clínica ',
          buttonDescription: 'Ver encargados de area',
          routerlink: '/admin/clinical-area',
        },
      ],
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
          routerlink: '/admin/patients/addPatient',
        },
      ],
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
          routerlink: '/admin/create-area',
        },
      ],
    },
    {
      fontAwesomeIcon: faFileUpload,
      buttonText: 'Carga de alumnos',
      buttonDescription: 'Subir excel de alumnos',
      routerlink: '/admin/upload-students',
    },
    {
      fontAwesomeIcon: faFileUpload,
      buttonText: 'Carga de archivos',
      buttonDescription: 'Subir archivos',
      routerlink: '/admin/upload-files',
    },
    {
      fontAwesomeIcon: faFileClipboard,
      buttonText: 'Tratamientos',
      buttonDescription: 'Reportes de tratamientos',
      routerlink: '/admin/treatments',
    },
  ];