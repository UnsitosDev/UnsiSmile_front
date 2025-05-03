export class Messages {
    // Mensajes de confirmación para salir
    public static readonly CONFIRM_LEAVE_CREATE_PATIENT = '¿Salir del registro de paciente?';
    public static readonly CONFIRM_LEAVE_HC_GENERAL = '¿Salir de Historia Clínica General?';
    public static readonly CONFIRM_LEAVE_HC_ORAL_PROTHESIS = '¿Salir de Historia Clínica Prótesis bucal?';
    public static readonly CONFIRM_LEAVE_HC_PERIODONTICS = '¿Salir de Historia Clínica Periodoncia?';
    public static readonly CONFIRM_LEAVE_HC_DENTAL_OPERATION = '¿Salir de Historia Clínica Operatoria dental?';
    public static readonly CONFIRM_LEAVE_HC_ORAL_SURGERY = '¿Salir de Historia Clínica Cirugía bucal?';
    public static readonly CONFIRM_LEAVE_HC_PREVENTIVE = '¿Salir de Historia Clínica Historia clinica Odontología preventiva y salud pública?';
    public static readonly CONFIRM_LEAVE_TREATMENTS = '¿Salir de tratamientos?';
    // Mensajes para insertar secciones de historia clinica
    public static readonly WARNING_FORM = 'Por favor, completa todos los campos requeridos';
    public static readonly SUCCES_INSERT_HC = 'Sección guardada correctamente';


    // Mensajes para actualizaciones de secciones de historias clínicas
    public static readonly WARNING_NO_DATA_TO_UPDATE = 'No se detectaron cambios para guardar'; 
    public static readonly SUCCESS_DATA_UPDATED = 'Sección actualizada correctamente';

    // Mensajes para insertar pacientes
    public static readonly WARNING_INSERT_PATIENT = 'Completa correctamente todos los campos para registrar al paciente'
    public static readonly SUCCES_INSERT_PATIENT = 'Paciente creado'
    public static readonly SUCCES_UPDATE_PATIENT = 'Paciente actualizado'

    // Mensajes para insertar alumnos
    public static readonly WARNING_INSERT_STUDENT = 'Completa correctamente todos los campos para registrar al alumno'
    public static readonly SUCCES_INSERT_STUDENT = 'Alumno creado'

    // Mensajes para insertar administradores
    public static readonly WARNING_INSERT_ADMIN = 'Completa correctamente todos los campos para registrar al administrador'
    public static readonly SUCCES_INSERT_ADMIN = 'Administrador creado'
    public static readonly SUCCES_UPDATE_ADMIN = 'Administrador actualizado'


    // Mensajes para subir alumnos
    public static readonly WARNING_INSERT_CYCLE = 'Completa todos los campos'
    public static readonly SUCCES_INSERT_CYCLE = 'Ciclo escolar guardado'
    public static readonly WARNING_NO_FILE_SELECTED = 'Selecciona un archivo'
    public static readonly ERROR_INSERT_FILE = 'Archivo no válido'

    // Mensajes para periodontograma  
    public static readonly SUCCESS_INSERT_PERIODONTOGRAM = 'Periodontograma Guardado'
    public static readonly NO_DATA_TO_SEND = 'Debe insertar datos en el periodontograma antes de guardar'
    public static readonly BAD_DATA = 'Asegúrate de haber llenado las filas'

    // Mensajes para subir consentimientos informados
    public static readonly WARNING_NO_FILE_SELECTED_FORMATS = 'Selecciona algun archivo'
    public static readonly SUCCESS_FORMATS = 'Formatos guardados.' 
    public static readonly NO_FILES_YET = 'Aún no hay archivos disponibles.';

    // Mensajes para notas de evolución
    public static readonly WARNING_PROGRESS_NOTE = 'Por favor, complete todos los campos requeridos.';
}
