import { faClinicMedical, faFileClipboard, faFileUpload, faHome, faPlus, faUserGraduate, faUsers, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "@mean/models";

// Menú para administradores
export const AdminItems: MenuItem[] = [
    {
      fontAwesomeIcon: faHome,
      buttonText: 'Inicio',
      buttonDescription: 'Inicio',
      routerlink: '/medical-admin/dashboard',
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
          routerlink: '/medical-admin/students',
          children: [
            {
              fontAwesomeIcon: faPlus,
              buttonText: 'Nuevo estudiante',
              buttonDescription: 'Registrar estudiante',
              routerlink: '/medical-admin/students/addStudent',
            },
          ],
        },
        {
          fontAwesomeIcon: faFileUpload,
          buttonText: 'Profesores',
          buttonDescription: 'Ver profesores',
          routerlink: '/medical-admin/professors',
          children: [
            {
              fontAwesomeIcon: faPlus,
              buttonText: 'Nuevo profesor',
              buttonDescription: 'Registrar profesor',
              routerlink: '/medical-admin/professors/addProfessor',
            },
          ],
        },
        {
          fontAwesomeIcon: faUserShield,
          buttonText: 'Administradores',
          buttonDescription: 'Ver administradores',
          routerlink: '/medical-admin/admins',
          children: [
            {
              fontAwesomeIcon: faPlus,
              buttonText: 'Nuevo administrador',
              buttonDescription: 'Registrar administrador',
              routerlink: '/medical-admin/admins/addAdmin',
            },
          ],
        },
        {
          fontAwesomeIcon: faUserShield,
          buttonText: 'Capturadores',
          buttonDescription: 'Ver capturadores',
          routerlink: '/medical-admin/digitizers',
          children: [
            {
              fontAwesomeIcon: faPlus,
              buttonText: 'Nuevo capturador',
              buttonDescription: 'Registrar capturador',
              routerlink: '/medical-admin/digitizers/addDigitizer',
            },
          ],
        },
        {
          fontAwesomeIcon: faUserShield,
          buttonText: 'Encargados de area clínica ',
          buttonDescription: 'Ver encargados de area',
          routerlink: '/medical-admin/clinical-area',
        },
      ],
    },
    {
      fontAwesomeIcon: faUserShield,
      buttonText: 'Pacientes',
      buttonDescription: 'Gestión de pacientes',
      routerlink: '/medical-admin/patients',
      children: [
        {
          fontAwesomeIcon: faPlus,
          buttonText: 'Nuevo paciente',
          buttonDescription: 'Registrar paciente',
          routerlink: '/medical-admin/patients/addPatient',
        },
      ],
    },
  
    {
      fontAwesomeIcon: faClinicMedical,
      buttonText: 'Áreas clínicas',
      buttonDescription: 'Ver áreas clínicas',
      routerlink: '/medical-admin/areas',
      children: [
        {
          fontAwesomeIcon: faPlus,
          buttonText: 'Nueva área clínica',
          buttonDescription: 'Crear nueva área clínica',
          routerlink: '/medical-admin/create-area',
        },
      ],
    },
    {
      fontAwesomeIcon: faFileUpload,
      buttonText: 'Carga de alumnos',
      buttonDescription: 'Subir excel de alumnos',
      routerlink: '/medical-admin/upload-students',
    },
    {
      fontAwesomeIcon: faFileUpload,
      buttonText: 'Carga de archivos',
      buttonDescription: 'Subir archivos',
      routerlink: '/medical-admin/upload-files',
    },
    {
      fontAwesomeIcon: faFileClipboard,
      buttonText: 'Tratamientos',
      buttonDescription: 'Reportes de tratamientos',
      routerlink: '/medical-admin/treatments',
    },
  ];