export class Messages {
    // Mensajes de confirmación para salir
    public static readonly CONFIRM_LEAVE_CREATE_PATIENT = '¿Salir del registro de paciente?';
    public static readonly CONFIRM_LEAVE_HC_GENERAL = '¿Salir de Historia Clínica General?';
    public static readonly CONFIRM_LEAVE_HC_ORAL_PROTHESIS = '¿Salir de Historia Clínica Prótesis bucal?';
    public static readonly CONFIRM_LEAVE_HC_PERIODONTICS = '¿Salir de Historia Clínica Periodoncia?';
    public static readonly CONFIRM_LEAVE_HC_DENTAL_OPERATION = '¿Salir de Historia Clínica Operatoria dental?';
    public static readonly CONFIRM_LEAVE_HC_ORAL_SURGERY = '¿Salir de Historia Clínica Cirugía bucal?';

    // Mensajes para insertar secciones de historia clinica
    public static readonly WARNING_FORM = 'Por favor, completa todos los campos requeridos';
    public static readonly SUCCES_INSERT_HC = 'Sección guardada correctamente';


    // Mensajes para actualizaciones de secciones de historias clínicas
    public static readonly WARNING_NO_DATA_TO_UPDATE = 'No se detectaron cambios para guardar'; 
    public static readonly SUCCESS_DATA_UPDATED = 'Sección actualizada correctamente';

    // Mensajes para insertar pacientes
    public static readonly WARNING_INSERT_PATIENT = 'Completa correctamente todos los campos para registrar al paciente'
    public static readonly SUCCES_INSERT_PATIENT = 'Paciente creado'

    // Mensajes para subir alumnos
    public static readonly WARNING_INSERT_CYCLE = 'Completa todos los campos'
    public static readonly SUCCES_INSERT_CYCLE = 'Ciclo escolar guardado'
    public static readonly WARNING_NO_FILE_SELECTED = 'Selecciona un archivo'
    public static readonly ERROR_INSERT_FILE = 'Archivo no válido'

}
