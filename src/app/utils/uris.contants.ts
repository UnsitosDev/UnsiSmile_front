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
  // tooth-region-controller
  public static readonly GETID_TOOTH_REGION =
    basePath + '/medical-histories/tooth-regions/';
  public static readonly GET_TOOTH_REGION =
    basePath + '/medical-histories/tooth-regions';
  public static readonly POST_TOOTH_REGION =
    basePath + '/medical-histories/tooth-regions';
  // tooth-region-periodontogram-controller
  public static readonly GETID_TOOTH_REGION_PERIODONTOGRAM =
    basePath + '/medical-histories/tooth-region-periodontograms/';
  public static readonly GET_TOOTH_REGION_PERIODONTOGRAM =
    basePath + '/medical-histories/tooth-region-periodontograms';
  public static readonly POST_TOOTH_REGION_PERIODONTOGRAM =
    basePath + '/medical-histories/tooth-region-periodontograms';
  // tooth-detail-controller
  public static readonly GETID_TOOTH_DETAIL =
    basePath + '/medical-histories/tooth-details/';
  public static readonly GET_TOOTH_DETAIL =
    basePath + '/medical-histories/tooth-details';
  public static readonly POST_TOOTH_DETAIL =
    basePath + '/medical-histories/tooth-details';
  // tooth-condition-controller
  public static readonly GETID_TOOTH_CONDITION =
    basePath + '/medical-histories/tooth-conditions/';
  public static readonly GET_TOOTH_CONDITION =
    basePath + '/medical-histories/tooth-conditions';
  public static readonly GET_TOOTH_FACE_CONDITION =
    basePath + '/medical-histories/tooth-face-conditions';
  public static readonly POST_TOOTH_CONDITION =
    basePath + '/medical-histories/tooth-conditions';
  // open-question-pathological-antecedents-controller
  public static readonly GETID_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/open-question-pathological-antecedents/';
  public static readonly GET_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/open-question-pathological-antecedents';
  public static readonly POST_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/open-question-pathological-antecedents';
  // odontogram-controller
  public static readonly GETID_ODONTOGRAM =
    basePath + '/medical-histories/odontograms/';
  public static readonly GET_ODONTOGRAM =
    basePath + '/medical-histories/odontograms';
  public static readonly POST_ODONTOGRAM =
    basePath + '/medical-histories/odontograms';
  // non-pathological-personal-antecedents-controller
  public static readonly GETID_PERSONAL_ANTECEDENTS_PATHOLOGICAL =
    basePath + '/medical-histories/non-pathological-personal-antecedents/';
  public static readonly GET_PERSONAL_ANTECEDENTS_PATHOLOGICAL =
    basePath + '/medical-histories/non-pathological-personal-antecedents';
  public static readonly POST_PERSONAL_ANTECEDENTS_PATHOLOGICAL =
    basePath + '/medical-histories/non-pathological-personal-antecedents';
  // hereditary-family-history-question-controller
  public static readonly GETID_HEREDITARY_FAMILY_HISTORY_QUESTION =
    basePath + '/medical-histories/hereditary-family-history-questions/';
  public static readonly GET_HEREDITARY_FAMILY_HISTORY_QUESTION =
    basePath + '/medical-histories/hereditary-family-history-questions';
  public static readonly POST_HEREDITARY_FAMILY_HISTORY_QUESTION =
    basePath + '/medical-histories/hereditary-family-history-questions';
  // hereditary-family-history-controller
  public static readonly GETID_HEREDITARY_FAMILY_HISTORY =
    basePath + '/medical-histories/hereditary-family-histories/';
  public static readonly GET_HEREDITARY_FAMILY_HISTORY =
    basePath + '/medical-histories/hereditary-family-histories';
  public static readonly POST_HEREDITARY_FAMILY_HISTORY =
    basePath + '/medical-histories/hereditary-family-histories';
  // facial-profile-controller
  public static readonly GETID_FACIAL_PROFILE =
    basePath + '/medical-histories/facial-profiles/';
  public static readonly GET_FACIAL_PROFILE =
    basePath + '/medical-histories/facial-profiles';
  public static readonly POST_FACIAL_PROFILE_ =
    basePath + '/medical-histories/facial-profiles';
  // facial-front-controller
  public static readonly GETID_FACIAL_FRONT =
    basePath + '/medical-histories/facial-fronts/';
  public static readonly GET_FACIAL_FRONT =
    basePath + '/medical-histories/facial-fronts';
  public static readonly GET_FACIAL_FRONT_BYNAME =
    basePath + '/medical-histories/facial-fronts/byName/';
  public static readonly POST_FACIAL_FRONT =
    basePath + '/medical-histories/facial-fronts';
  // facial-exam-controller
  public static readonly GETID_FACIAL_EXAM =
    basePath + '/medical-histories/facial-exams/';
  public static readonly GET_FACIAL_EXAM =
    basePath + '/medical-histories/facial-exams';
  public static readonly POST_FACIAL_EXAM =
    basePath + '/medical-histories/facial-exams';
  // dental-code-controller
  public static readonly GETID_DENTAL_CODE =
    basePath + '/medical-histories/dental-codes/';
  public static readonly GET_DENTAL_CODE =
    basePath + '/medical-histories/dental-codes';
  public static readonly POST_DENTAL_CODE =
    basePath + '/medical-histories/dental-codes';
  // closed-question-pathological-antecedents-controller
  public static readonly GETID_CLOSED_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/closed-question-pathological-antecedents/';
  public static readonly GET_CLOSED_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/closed-question-pathological-antecedents';
  public static readonly POST_CLOSED_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/closed-question-pathological-antecedents';
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
    basePath + '/medical-histories/housing-materials/';
  public static readonly GET_HOUSING_MATERIAL =
    basePath + '/medical-histories/housing-materials';
  public static readonly POST_HOUSING_MATERIAL =
    basePath + '/medical-histories/housing-materials';
  // auth-controller
  public static readonly POST_AUTH = basePath + '/auth/register';
  public static readonly POSTB_AUTH = basePath + '/auth/register';
  public static readonly PATCH_UPDATE_PASSWORD = basePath + '/auth/update-password';
  public static readonly PATCH_AUTH = basePath + '/auth/reset-password-to-default';

  //person controller
  public static readonly GETID_PERSON = basePath + '/persons/';
  public static readonly GET_PERSON = basePath + '/persons';
  public static readonly POST_PERSON = basePath + '/persons';
  public static readonly PATCH_PERSON_BY_CURP = basePath + '/people/'; // Nuevo endpoint para actualizar por CURP

  // grupos
  public static readonly GETID_GROUPS = basePath + '/groups/';
  public static readonly GET_GROUPS = basePath + '/groups';
  public static readonly POST_GROUPS = basePath + '/groups';

  // semestres
  public static readonly GETID_SEMESTER = basePath + '/semesters/';
  public static readonly GET_SEMESTER = basePath + '/semesters';
  public static readonly POST_SEMESTER = basePath + '/semesters';
  public static readonly GET_SEMESTERS = basePath + '/semesters';
  // region measurement pockets
  public static readonly GETID_REGION_MEASUREMENT_POCKETS =
    basePath + '/medical-histories/region-measurement-pockets/';
  public static readonly GET_REGION_MEASUREMENT_POCKETS =
    basePath + '/medical-histories/region-measurement-pockets';
  public static readonly POST_REGION_MEASUREMENT_POCKETS =
    basePath + '/medical-histories/region-measurement-pockets';
  // pocket measurement detail
  public static readonly GETID_POCKET_MEASUREMENT_DETAIL =
    basePath + '/medical-histories/pocket-measurement-details/';
  public static readonly GET_POCKET_MEASUREMENT_DETAIL =
    basePath + '/medical-histories/region-measurement-pockets';
  public static readonly POST_POCKET_MEASUREMENT_DETAIL =
    basePath + '/medical-histories/region-measurement-pockets';
  // periodontograma
  public static readonly GETID_PERIODONTOGRAM =
    basePath + '/medical-histories/periodontograms/';
  public static readonly GET_PERIODONTOGRAM =
    basePath + '/medical-histories/periodontograms';
  public static readonly POST_PERIODONTOGRAM =
    basePath + '/medical-histories/periodontograms';
  // open question pathological antecedentes
  public static readonly GETID_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/open-question-pathological-antecedents/';
  public static readonly GET_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/open-question-pathological-antecedents';
  public static readonly POST_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS =
    basePath + '/medical-histories/open-question-pathological-antecedents';

  //´getpacientes
  public static readonly GET_PATIENTS = basePath + '/patients';

  public static readonly GET_STUDENTS = basePath + '/students';
  public static readonly POST_STUDENTS = basePath + '/students';
  public static readonly PATCH_STUDENTS = basePath + '/students';

  public static readonly GET_STUDENT_BY_ENROLLMENT = basePath + '/students';
  public static readonly PUT_STUDENT = basePath + '/students/';
  public static readonly PATCH_STUDENT = basePath + '/students/';

  public static readonly GET_STUDENTS_ENROLLMENT = basePath + '/students/enrollments';


  public static readonly POST_ADMIN = basePath + '/administrators';
  public static readonly GET_ADMIN = basePath + '/administrators';
  public static readonly PATCH_ADMIN = basePath + '/administrators';
  public static readonly GET_ADMIN_BY_EMPLOYEENUMBER = basePath + '/administrators/';
  public static readonly PATCH_ADMIN_BY_EMPLOYEENUMBER = basePath + '/administrators/';

  // vital-signs-controller
  public static readonly GETID_VITAL_SIGNS =
    basePath + '/medical-histories/vital-signs/{id}';
  public static readonly GET_VITAL_SIGNS =
    basePath + '/medical-histories/vital-signs';
  public static readonly POST_VITAL_SIGNS =
    basePath + '/medical-histories/vital-signs';
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
  public static readonly GET_STREETS_NEIGHBORHOOD = basePath + '/streets/neighborhood/';

  // neighborhood-controller
  public static readonly GET_NEIGHBORHOODS = basePath + '/neighborhoods';
  public static readonly GET_NEIGHBORHOODS_LOCALITY =
    basePath + '/neighborhoods/locality/';

  // municipality-controller
  //   public static readonly GET_MUNICIPALITY = basePath + '/address/municipalities?page=0&size=10&order=name&asc=true'
  public static readonly GET_MUNICIPALITY = basePath + '/municipalities';
  public static readonly GET_MUNICIPALITY_STATE =
    basePath + '/municipalities/state/';

  // state-controller
  public static readonly GET_STATE = basePath + '/states';
  // Patient controller
  public static readonly POST_PATIENT = basePath + '/patients';
  public static readonly POST_GUARDIAN = basePath + '/guardian';
  public static readonly GET_PATIENT_BY_ID = basePath + '/patients/';
  public static readonly PATCH_PATIENT_BY_ID = basePath + '/patients/';


  public static readonly POST_PATIENT_STUDENT = basePath + '/patients/students';

  public static readonly GET_USER_INFO = basePath + '/users/user-information';
  public static readonly GET_USER_PROFILE = basePath + '/users/profile';
  public static readonly GET_USER_PROFILE_PICTURE = basePath + '/users/profile-picture';
  public static readonly UPDATE_PROFILE_PICTURE = basePath + '/users/update-profile-picture';
  // get postalCode
  public static readonly GET_POSTAL_CODE = basePath + '/locality/postal-code/';
  // Historias Clinicas
  public static readonly GET_CONFIG_HISTORY_CLINICS =
    basePath + '/clinical-histories/patient-clinical-histories';
  // Crear Historia Clinica del paciente
  public static readonly POST_CLINICAL_HISTORY =
    basePath + '/clinical-histories/patient-clinical-history';
  // Obtener la configuracion de la historia clinica:
  public static readonly GET_HISTORY_CONFIG = basePath + '/clinical-histories';
  // Obtiene una lista de historías clínicas y su relación con el paciente.
  public static readonly GET_PATIENT_HISTORIES =
    basePath + '/clinical-histories';
  // Enviar seccion del formulario
  public static readonly POST_SECTION_FORM = basePath + '/answers/forms';
  // Enviar archivos
  public static readonly POST_FILES = basePath + '/files';
  // Descargar archivo
  public static readonly DOWLOAD_FILES = basePath + '/files/file/';
  // obtener el odontograma mas reciente
  public static readonly GET_LAST_ODONTOGRAM_BY_PATIENT = basePath + '/medical-histories/odontograms/latest'
  // Crear semestre
  public static readonly POST_SEMESTERS = basePath +   '/semesters'
  // Subir archivo de estudiantes
  public static readonly UPLOAD_STUDENTS = basePath + '/students/upload'
  // Semestre actual
  public static readonly GET_CURRENT_SEMESTER = basePath + '/semesters/current-semester'
  // Ciclos
  public static readonly GET_ALL_CYCLES = basePath + '/cycles'

  //obtener un odontogram por id de formulario
  public static readonly GET_ODONTOGRAM_BY_FORM_ID = basePath + '/medical-histories/odontograms'

  public static readonly REFRESH_TOKEN_ENDPOINT = basePath + '/auth/refresh';

  // Post periodontograma
  public static readonly POST_PERIODONTOGRAM_HC = basePath + '/medical-records/periodontograms'
  // obtener periodontograma
  public static readonly GET_PERIODONTOGRAM_ID = basePath +  '/medical-records/periodontograms/patient'
  // Actualizar periodontograma
  public static readonly PUT_PERIODONTOGRAM = basePath + '/medical-records/periodontograms'
  // Carga archivos generales
  public static readonly POST_GENERAL_FILES = basePath + '/files/general'
  // Obtener formatos generales
  public static readonly GET_FORMATS = basePath + '/form-sections'
  // Obtener estado civil de los padres
  public static readonly GET_PARENTS_MARITAL_STATUS = basePath + '/catalog-options/catalog' 
  // Obtener profesores encargados de area
  public static readonly GET_PROFESOR_AREA = basePath + '/catalog-options/catalog'
  // Obtener una lista paginada de notas de evolución de un paciente
  public static readonly GET_PAGINATED_EVOLUTION_NOTES = basePath + '/progress-notes';
  // Obtener nota para descarga
  public static readonly DOWNLOAD_EVOLUTION_NOTE = basePath + '/progress-notes/files';
  // Crear un registro de nota de evolucion
  public static readonly POST_EVOLUTION_NOTE = basePath + '/progress-notes';
  // Subir nota de evoluvion
  public static readonly POST_EVOLUTION_NOTE_FILE = basePath + '/progress-notes/files';
  
  public static readonly GET_ADMIN_DASHBOARD = basePath + '/dashboards/admins';
  public static readonly GET_STUDENT_DASHBOARD = basePath + '/dashboards/students';
  public static readonly GET_PROFESSORS_DASHBOARD = basePath + '/dashboards/teachers';

  public static readonly POST_CLINICAL_HISTORY_REVIEW = basePath + '/medical-records/status/send-to-review/patient-medical-records'
  // Obtener el estado de la historia clinica
  public static readonly GET_CLINICAL_HISTORY_STATUS = basePath + '/medical-records/status';
  public static readonly GET_HC_TO_REVIEW = basePath +'/medical-records/status/list'
  public static readonly SAVE_REVIEW_HC = basePath + '/medical-records/status'

  public static readonly GET_PROFESSORS = basePath + '/professors';
  public static readonly POST_PROFESSORS = basePath + '/professors';
  public static readonly PATCH_PROFESSORS = basePath + '/professors';

  public static readonly POST_CLINICAL_AREA = basePath + '/clinical-areas';
  public static readonly GET_CLINICAL_AREAS = basePath + '/clinical-areas';
  public static readonly DELETE_CLINICAL_AREA = basePath + '/clinical-areas'; 

  public static POST_PROFESSOR_CLINICAL_AREAS = basePath + '/professor-clinical-areas';
  public static GET_PROFESSOR_CLINICAL_AREAS = basePath + '/professor-clinical-areas';
  public static GET_PROFESSOR_CLINICAL_AREA_BY_ID = basePath + '/professor-clinical-areas/';
  public static DELETE_PROFESSOR_CLINICAL_AREAS = basePath + '/professor-clinical-areas/';

  public static readonly GET_CONDITION_PROFILAXIS_FACE = basePath + '/medical-histories/tooth-face-conditions/prophylaxis';
  public static readonly GET_CONDITION_PROFILAXIS_TOOTH = basePath + '/medical-histories/tooth-conditions/prophylaxis';
  public static readonly POS_PROFILAXIS = basePath + '/medical-histories/dental-prophylaxis'; 
  public static readonly GET_PROFILAXIS = basePath + '/medical-histories/dental-prophylaxis';
  public static readonly GET_PROFESSORS_AREAS = basePath + '/professor-clinical-areas'

  public static readonly GET_TREATMENTS = basePath + '/treatments';
  public static readonly POST_TREATMENTS = basePath + '/treatment-details'; 
}
