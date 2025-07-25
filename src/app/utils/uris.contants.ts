import { isDevMode } from '@angular/core';

const host = isDevMode()
  ? 'http://localhost:8082/unsismile/api/v1'
  : 'https://unsismile-back.unsis.edu.mx/unsismile/api/v1';
const basePath = host;

export class UriConstants {
  public static readonly HOST = host;
  public static readonly MESSAGES = basePath + '/messages';
  public static readonly USER_LOGIN = basePath + '/auth/login';
  public static readonly USER_REGISTER = basePath + '/auth/register';

  // tooth-condition-controller
  public static readonly GETID_TOOTH_CONDITION =
    basePath + '/medical-records/tooth-conditions/';
  public static readonly GET_TOOTH_CONDITION =
    basePath + '/medical-records/tooth-conditions';
  public static readonly GET_TOOTH_FACE_CONDITION =
    basePath + '/medical-records/tooth-face-conditions';
  public static readonly POST_TOOTH_CONDITION =
    basePath + '/medical-records/tooth-conditions';
  // odontogram-controller
  public static readonly GET_ODONTOGRAM =
    basePath + '/medical-records/odontograms';
  public static readonly POST_ODONTOGRAM =
    basePath + '/medical-records/odontograms';
  public static GET_ODONTOGRAMS_BY_PATIENT_MEDICAL_RECORD_ID =
    basePath +
    '/medical-records/odontograms/patient-medical-record/:patientMedicalRecordId';
  // group-controller
  public static readonly GETID_GROUP = basePath + '/groups/';
  public static readonly GET_GROUP = basePath + '/groups';
  public static readonly POST_GROUP = basePath + '/groups';
  // gender-controller
  public static readonly GETID_GENDER = basePath + '/genders/';
  public static readonly GET_GENDER = basePath + '/genders';
  public static readonly POST_GENDER = basePath + '/genders';
  // cycle-controller
  public static readonly GETID_CYCLE = basePath + '/cycles/';
  public static readonly GET_CYCLE = basePath + '/cycles';
  public static readonly POST_CYCLE = basePath + '/cycles';
  // career-controller
  public static readonly GETID_CARRER = basePath + '/careers/';
  public static readonly GET_CARRER = basePath + '/careers';
  public static readonly POST_CARRER = basePath + '/careers';
  public static readonly GET_CAREERS = basePath + '/careers';
  // housing-material-controller
  public static readonly GETID_HOUSING_MATERIAL =
    basePath + '/medical-records/housing-materials/';
  public static readonly GET_HOUSING_MATERIAL =
    basePath + '/medical-records/housing-materials';
  public static readonly POST_HOUSING_MATERIAL =
    basePath + '/medical-records/housing-materials';
  // auth-controller
  public static readonly POST_AUTH = basePath + '/auth/register';
  public static readonly POSTB_AUTH = basePath + '/auth/register';
  public static readonly PATCH_UPDATE_PASSWORD = basePath + '/auth/password';
  public static readonly PATCH_AUTH = basePath + '/auth/password/default';

  //person controller
  public static readonly GETID_PERSON = basePath + '/persons/';
  public static readonly GET_PERSON = basePath + '/persons';
  public static readonly POST_PERSON = basePath + '/persons';
  public static readonly PATCH_PERSON_BY_CURP = basePath + '/people/';
  public static readonly GET_PERSON_BY_CURP = basePath + '/people/';

  // grupos
  public static readonly GETID_GROUPS = basePath + '/groups/';
  public static readonly GET_GROUPS = basePath + '/groups';
  public static readonly POST_GROUPS = basePath + '/groups';

  // semestres
  public static readonly GETID_SEMESTER = basePath + '/semesters/';
  public static readonly GET_SEMESTER = basePath + '/semesters';
  public static readonly POST_SEMESTER = basePath + '/semesters';
  public static readonly GET_SEMESTERS = basePath + '/semesters';
  // periodontograma
  public static readonly GETID_PERIODONTOGRAM =
    basePath + '/medical-records/periodontograms/';
  public static readonly GET_PERIODONTOGRAM =
    basePath + '/medical-records/periodontograms';
  public static readonly POST_PERIODONTOGRAM =
    basePath + '/medical-records/periodontograms';
  // open question pathological antecedentes
  public static readonly GETID_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-records/open-question-pathological-antecedents/';
  public static readonly GET_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-records/open-question-pathological-antecedents';
  public static readonly POST_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-records/open-question-pathological-antecedents';

  //´getpacientes
  public static readonly GET_PATIENTS = basePath + '/patients';

  public static readonly GET_STUDENTS = basePath + '/students';
  public static readonly POST_STUDENTS = basePath + '/students';
  public static readonly PATCH_STUDENTS = basePath + '/students';

  public static readonly GET_STUDENT_BY_ENROLLMENT = basePath + '/students';
  public static readonly PUT_STUDENT = basePath + '/students/';
  public static readonly PATCH_STUDENT = basePath + '/students/';

  public static readonly GET_STUDENTS_ENROLLMENT =
    basePath + '/students/enrollments';

  // Endpoint para eliminar estudiante asignado a un paciente
  public static readonly DELETE_PATIENT_STUDENT =
    basePath + '/patients/:patientId/students/:studentId';

  public static readonly POST_ADMIN = basePath + '/administrators';
  public static readonly GET_ADMIN = basePath + '/administrators';
  public static readonly PATCH_ADMIN = basePath + '/administrators';
  public static readonly GET_ADMIN_BY_EMPLOYEENUMBER =
    basePath + '/administrators/';
  public static readonly PATCH_ADMIN_BY_EMPLOYEENUMBER =
    basePath + '/administrators/';

  // religion-controller
  public static readonly GETID_RELIGION = basePath + '/patients/religion/';
  public static readonly GET_RELIGION = basePath + '/religions';
  // nationality-controller
  public static readonly GET_NACIONALITY = basePath + '/nationalities';
  // occupation-controller
  public static readonly GET_OCUPATION = basePath + '/occupations';
  // marital-status-controller
  public static readonly GET_MARITAL_STATUS = basePath + '/marital-status';
  // ethnic-group-controller
  public static readonly GET_ETHNIC_GROUP = basePath + '/ethnic-groups';
  // locality-controller
  public static readonly GET_LOCALITIES = basePath + '/locality';
  public static readonly GET_LOCALITIES_NAME = basePath + '/locality/name/';
  public static readonly GET_LOCALITIES_MUNICIPALITY =
    basePath + '/locality/municipality/';

  // housing-controller
  public static readonly GET_HOUSING = basePath + '/housing';
  // street-controller
  public static readonly GET_STREETS = basePath + '/streets';
  public static readonly GET_STREETS_NEIGHBORHOOD =
    basePath + '/streets/neighborhood/';

  // neighborhood-controller
  public static readonly GET_NEIGHBORHOODS = basePath + '/neighborhoods';
  public static readonly GET_NEIGHBORHOODS_LOCALITY =
    basePath + '/neighborhoods/locality/';

  // municipality-controller
  //   public static readonly GET_MUNICIPALITY = basePath + '/address/municipalities?page=0&size=10&order=name&asc=true'
  public static readonly GET_MUNICIPALITY = basePath + '/municipalities';
  public static readonly GET_MUNICIPALITY_STATE =
    basePath + '/municipalities/state/';

  // state-controller (ej: oaxaca)
  public static readonly GET_STATE = basePath + '/states';
  // Patient controller
  public static readonly POST_PATIENT = basePath + '/patients';
  public static readonly POST_GUARDIAN = basePath + '/guardians';
  public static readonly GET_PATIENT_BY_ID = basePath + '/patients/';
  public static readonly PATCH_PATIENT_BY_ID = basePath + '/patients/';

  public static readonly POST_PATIENT_STUDENT = basePath + '/patients/students';

  public static readonly GET_USER_INFO = basePath + '/users/user-information';
  public static readonly GET_USER_PROFILE = basePath + '/users/profile';
  public static readonly GET_USER_PROFILE_PICTURE =
    basePath + '/users/profile-picture';
  public static readonly UPDATE_PROFILE_PICTURE =
    basePath + '/users/update-profile-picture';
  // get postalCode
  public static readonly GET_POSTAL_CODE = basePath + '/locality/postal-code/';
  // Historias Clinicas
  public static readonly GET_MEDICAL_RECORDS_PATIENT =
    basePath + '/medical-records/patient-medical-records';
  // Crear Historia Clinica del paciente
  public static readonly POST_CLINICAL_HISTORY =
    basePath + '/medical-records/patient-medical-record';
  // Obtener la configuracion de la historia clinica:
  public static readonly GET_MEDICAL_RECORD_CONFIG =
    basePath + '/medical-records';

  // Obtener la configuracion de la historia clinica por paciente
  public static readonly GET_MEDICAL_RECORD_CONFIG_BY_PATIENT =
    basePath +
    '/medical-records/catalog/:medicalRecordType/patients/:idPatient';

  // Obtiene una lista de historías clínicas y su relación con el paciente.
  public static readonly GET_PATIENT_HISTORIES = basePath + '/medical-records';
  // Enviar seccion del formulario
  public static readonly POST_SECTION_FORM = basePath + '/answers/forms';
  // Enviar archivos
  public static readonly POST_FILES = basePath + '/files';
  // Descargar archivo
  public static readonly DOWLOAD_FILES = basePath + '/files/general-files/';
  public static readonly DOWLOAD_FILES_SECTION = basePath + '/files/file';
  // obtener el odontograma mas reciente
  public static readonly GET_LAST_ODONTOGRAM_BY_PATIENT =
    basePath + '/medical-records/odontograms/latest';
  // Crear semestre
  public static readonly POST_SEMESTERS = basePath + '/semesters';
  // Subir archivo de estudiantes
  public static readonly UPLOAD_STUDENTS = basePath + '/students/upload';
  // Semestre actual
  public static readonly GET_CURRENT_SEMESTER =
    basePath + '/semesters/current-semester';
  // Ciclos
  public static readonly GET_ALL_CYCLES = basePath + '/cycles';

  //obtener un odontogram por id de formulario
  public static readonly GET_ODONTOGRAM_BY_FORM_ID =
    basePath + '/medical-records/odontograms';
  public static readonly GET_ODONTOGRAM_BY_ID =
    basePath + '/medical-records/odontograms/:idOdontogram';

  public static readonly REFRESH_TOKEN_ENDPOINT = basePath + '/auth/refresh';

  // Post periodontograma
  public static readonly POST_PERIODONTOGRAM_HC =
    basePath + '/medical-records/periodontograms';
  // obtener periodontograma
  public static readonly GET_PERIODONTOGRAM_ID =
    basePath + '/medical-records/periodontograms/patient';
  // Actualizar periodontograma
  public static readonly PUT_PERIODONTOGRAM =
    basePath + '/medical-records/periodontograms';
  // Carga archivos generales
  public static readonly POST_GENERAL_FILES = basePath + '/files/general-files';
  // Obtener formatos generales
  public static readonly GET_FORMATS = basePath + '/files/general-files';
  // Obtener estado civil de los padres
  public static readonly GET_PARENTS_MARITAL_STATUS =
    basePath + '/catalog-options/catalog';
  // Obtener profesores encargados de area
  public static readonly GET_PROFESOR_AREA =
    basePath + '/catalog-options/catalog';
  // Obtener una lista paginada de notas de evolución de un paciente
  public static readonly GET_PAGINATED_EVOLUTION_NOTES =
    basePath + '/progress-notes';
  // Obtener nota para descarga
  public static readonly DOWNLOAD_EVOLUTION_NOTE =
    basePath + '/progress-notes/files';
  // Crear un registro de nota de evolucion
  public static readonly POST_EVOLUTION_NOTE = basePath + '/progress-notes';
  // Subir nota de evoluvion
  public static readonly POST_EVOLUTION_NOTE_FILE =
    basePath + '/progress-notes/files';
  public static readonly GET_ADMIN_DASHBOARD = basePath + '/dashboards/admins';
  public static readonly GET_STUDENT_DASHBOARD =
    basePath + '/dashboards/students';
  public static readonly GET_PROFESSORS_DASHBOARD =
    basePath + '/dashboards/professors';
  public static readonly GET_SUPERVISOR_DASHBOARD =
    basePath + '/dashboards/clinical-supervisors';
  public static readonly POST_CLINICAL_HISTORY_REVIEW =
    basePath + '/medical-records/status';
  // Obtener el estado de la historia clinica
  public static readonly GET_CLINICAL_HISTORY_STATUS =
    basePath + '/medical-records/status';
  public static readonly GET_HC_TO_REVIEW =
    basePath + '/medical-records/status/review/assigned-sections';
  public static readonly SAVE_REVIEW_HC = basePath + '/medical-records/status';

  public static readonly GET_PROFESSORS = basePath + '/professors';
  public static readonly POST_PROFESSORS = basePath + '/professors';
  public static readonly PATCH_PROFESSORS = basePath + '/professors';
  public static readonly GET_PROFESSOR_GROUP =
    basePath + '/professors/professor-groups/professors/ ';
  public static readonly GET_PROFESSOR_GROUPS =
    basePath + '/professors/professor-groups/professors';

  public static readonly POST_CLINICAL_AREA = basePath + '/clinical-areas';
  public static readonly GET_CLINICAL_AREAS = basePath + '/clinical-areas';
  public static readonly DELETE_CLINICAL_AREA = basePath + '/clinical-areas';

  public static POST_PROFESSOR_CLINICAL_AREAS =
    basePath + '/professor-clinical-areas';
  public static GET_PROFESSOR_CLINICAL_AREAS =
    basePath + '/professor-clinical-areas';
  public static GET_PROFESSOR_CLINICAL_AREA_BY_ID =
    basePath + '/professor-clinical-areas/';
  public static DELETE_PROFESSOR_CLINICAL_AREAS =
    basePath + '/professor-clinical-areas/';

  public static readonly GET_CONDITION_PROFILAXIS_FACE =
    basePath + '/medical-records/tooth-face-conditions/prophylaxis';
  public static readonly GET_CONDITION_PROFILAXIS_TOOTH =
    basePath + '/medical-records/tooth-conditions/prophylaxis';
  public static readonly POS_PROFILAXIS =
    basePath + '/medical-records/dental-prophylaxis';
  public static readonly GET_PROFILAXIS =
    basePath + '/medical-records/dental-prophylaxis/treatments';
  public static readonly GET_PROFESSORS_AREAS =
    basePath + '/professor-clinical-areas';

  public static readonly GET_TREATMENTS = basePath + '/treatments';
  public static readonly GET_MEDICAL_RECORDS = basePath + '/medical-records';
  public static readonly GET_GENERAL_MEDICAL_RECORD =
    basePath + '/medical-records/general';
  public static readonly POST_GENERAL_MEDICAL_RECORD =
    basePath + '/medical-records/general';

  public static readonly DOWLOAD_FORMAT_PROGRESS_NOTES =
    basePath + '/progress-notes/files';
  public static readonly DOWLOAD_SIGNED_NOTES =
    basePath + '/progress-notes/files';

  // Endpoints para guardianes/tutores
  public static readonly GET_GUARDIAN_BY_CURP = basePath + '/guardians/CURP/';

  /**
   * End points para tratamientos detalles
   */
  public static readonly POST_RATE_TREATMENT = basePath + '/treatment-details';
  public static readonly GET_TREATMENT_REVIEW =
    basePath + '/treatment-details/professors';
  public static readonly POST_TREATMENT_REVIEW =
    basePath + '/treatment-details';
  public static readonly POST_TREATMENTS = basePath + '/treatment-details';
  public static readonly PUT_TREATMENT = basePath + '/treatment-details';
  public static readonly GET_ALL_TREATMENTS =
    basePath + '/treatment-details/students';
  public static readonly GET_TREATMENT_BY_ID =
    basePath + '/treatment-details/patients';
  public static readonly GET_TREATMENTS_DETAILS =
    basePath + '/treatment-details/:idTreatmentDetail';

  public static readonly POST_IHOS =
    basePath + '/medical-records/dental-prophylaxis/sohi';
  public static readonly GET_IHOS =
    basePath + '/medical-records/dental-prophylaxis/sohi/treatment';
  public static readonly POST_FLUOROSIS =
    basePath + '/medical-records/fluorosis';
  public static readonly GET_FLUOROSIS_BY_PATIENT =
    basePath + '/medical-records/fluorosis/treatments';
  public static readonly POST_DEAN_INDEX =
    basePath + '/medical-records/fluorosis/dean-index';
  public static readonly GET_DEAN_INDEX =
    basePath + '/medical-records/fluorosis/dean-index/treatment';


  public static readonly GET_PATIENTS_DIGITIZER = basePath + '/digitizer-patients';
  public static readonly POST_PATIENT_DIGITIZER = basePath + '/digitizers/patients'
  public static readonly GET_DIGITIZERS = basePath + '/medical-record-digitizers';
  public static readonly POST_DIGITIZER = basePath + '/medical-record-digitizers';
  public static readonly PATCH_DIGITIZER_STATUS = basePath + '/medical-record-digitizers';
  public static readonly DELETE_DIGITIZER = basePath + '/medical-record-digitizers';

  public static readonly GET_MEDICAL_RECORDS_BY_ID = basePath + '/digitizers/patients/medical-records';
  public static readonly POST_RELATIONSHIP_MEDICAL_RECORDS = basePath + '/medical-records/patient-medical-record';
  public static readonly GET_TREATMENT_DETAIL_REPORTS =
    basePath + '/treatment-details/reports';
  public static readonly GET_PATIENTS_FOR_REPORTS =
    basePath + '/treatment-details/students/report';
  public static readonly GET_GENERATE_REPORT_TREATMENT =
    basePath + '/treatment-details/reports/students';
  public static readonly GET_FORM_SECTION =
    basePath +
    '/form-sections/:formSectionId?idPatientMedicalRecord=:idPatientMedicalRecord';
  public static readonly DELETE_FILE_GENERAL =
    basePath + '/files/general-files';
  public static readonly PATCH_AUTHORIZATION_TREATMENT =
    basePath + '/treatment-details';

}
