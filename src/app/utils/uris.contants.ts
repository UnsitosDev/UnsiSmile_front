import { isDevMode } from '@angular/core';

const host = isDevMode() ? 'http://localhost:8080/unsismile/api/v1' : 'otherdomain.com';
const basePath = host;
export class UriConstants {
  public static readonly HOST = host;
  public static readonly MESSAGES = basePath + '/messages';
  public static readonly USER_LOGIN = basePath + '/auth/login';
  public static readonly USER_REGISTER = basePath + '/auth/register';
  // tooth-region-controller
  public static readonly GETID_TOOTH_REGION = basePath + '/medical-histories/tooth-regions/'
  public static readonly GET_TOOTH_REGION = basePath + '/medical-histories/tooth-regions'
  public static readonly POST_TOOTH_REGION = basePath + '/medical-histories/tooth-regions'
  // tooth-region-periodontogram-controller
  public static readonly GETID_TOOTH_REGION_PERIODONTOGRAM = basePath + '/medical-histories/tooth-region-periodontograms/'
  public static readonly GET_TOOTH_REGION_PERIODONTOGRAM= basePath + '/medical-histories/tooth-region-periodontograms'
  public static readonly POST_TOOTH_REGION_PERIODONTOGRAM = basePath + '/medical-histories/tooth-region-periodontograms'
  // tooth-detail-controller
  public static readonly GETID_TOOTH_DETAIL = basePath + '/medical-histories/tooth-details/'
  public static readonly GET_TOOTH_DETAIL = basePath + '/medical-histories/tooth-details'
  public static readonly POST_TOOTH_DETAIL = basePath + '/medical-histories/tooth-details'
  // tooth-condition-controller
  public static readonly GETID_TOOTH_CONDITION = basePath + '/medical-histories/tooth-conditions/'
  public static readonly GET_TOOTH_CONDITION = basePath + '/medical-histories/tooth-conditions'
  public static readonly POST_TOOTH_CONDITION = basePath + '/medical-histories/tooth-conditions'
  // open-question-pathological-antecedents-controller
  public static readonly GETID_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/open-question-pathological-antecedents/'
  public static readonly GET_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/open-question-pathological-antecedents'  
  public static readonly POST_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/open-question-pathological-antecedents'
  // odontogram-controller
  public static readonly GETID_ODONTOGRAM = basePath + '/medical-histories/odontograms/'
  public static readonly GET_ODONTOGRAM = basePath + '/medical-histories/odontograms'
  public static readonly POST_ODONTOGRAM = basePath + '/medical-histories/odontograms'
  // non-pathological-personal-antecedents-controller
  public static readonly GETID_PERSONAL_ANTECEDENTS_PATHOLOGICAL = basePath + '/medical-histories/non-pathological-personal-antecedents/'
  public static readonly GET_PERSONAL_ANTECEDENTS_PATHOLOGICAL = basePath + '/medical-histories/non-pathological-personal-antecedents'
  public static readonly POST_PERSONAL_ANTECEDENTS_PATHOLOGICAL = basePath + '/medical-histories/non-pathological-personal-antecedents'
  // hereditary-family-history-question-controller
  public static readonly GETID_HEREDITARY_FAMILY_HISTORY_QUESTION = basePath + '/medical-histories/hereditary-family-history-questions/'
  public static readonly GET_HEREDITARY_FAMILY_HISTORY_QUESTION = basePath + '/medical-histories/hereditary-family-history-questions'
  public static readonly POST_HEREDITARY_FAMILY_HISTORY_QUESTION  = basePath + '/medical-histories/hereditary-family-history-questions'
  // hereditary-family-history-controller
  public static readonly GETID_HEREDITARY_FAMILY_HISTORY = basePath + '/medical-histories/hereditary-family-histories/'
  public static readonly GET_HEREDITARY_FAMILY_HISTORY = basePath + '/medical-histories/hereditary-family-histories'
  public static readonly POST_HEREDITARY_FAMILY_HISTORY = basePath + '/medical-histories/hereditary-family-histories'
  // facial-profile-controller
  public static readonly GETID_FACIAL_PROFILE = basePath + '/medical-histories/facial-profiles/'
  public static readonly GET_FACIAL_PROFILE = basePath + '/medical-histories/facial-profiles'
  public static readonly POST_FACIAL_PROFILE_= basePath + '/medical-histories/facial-profiles'
  // facial-front-controller
  public static readonly GETID_FACIAL_FRONT = basePath + '/medical-histories/facial-fronts/'
  public static readonly GET_FACIAL_FRONT = basePath + '/medical-histories/facial-fronts'
  public static readonly GET_FACIAL_FRONT_BYNAME = basePath + '/medical-histories/facial-fronts/byName/'
  public static readonly POST_FACIAL_FRONT = basePath + '/medical-histories/facial-fronts'
  // facial-exam-controller
  public static readonly GETID_FACIAL_EXAM = basePath + '/medical-histories/facial-exams/'
  public static readonly GET_FACIAL_EXAM = basePath + '/medical-histories/facial-exams'
  public static readonly POST_FACIAL_EXAM = basePath + '/medical-histories/facial-exams'
  // dental-code-controller
  public static readonly GETID_DENTAL_CODE = basePath + '/medical-histories/dental-codes/'
  public static readonly GET_DENTAL_CODE = basePath + '/medical-histories/dental-codes'
  public static readonly POST_DENTAL_CODE = basePath + '/medical-histories/dental-codes'
  // closed-question-pathological-antecedents-controller
  public static readonly GETID_CLOSED_QUESTION_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/closed-question-pathological-antecedents/'
  public static readonly GET_CLOSED_QUESTION_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/closed-question-pathological-antecedents'
  public static readonly POST_CLOSED_QUESTION_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/closed-question-pathological-antecedents'
  // group-controller
  public static readonly GETID_GROUP = basePath + '/groups/'
  public static readonly GET_GROUP = basePath + '/groups'
  public static readonly POST_GROUP = basePath + '/groups'
  // gender-controller
  public static readonly GETID_GENDER = basePath + '/genders/'
  public static readonly GET_GENDER = basePath + '/genders'
  public static readonly POST_GENDER = basePath + '/genders'
  // cycle-controller
  public static readonly GETID_CYCLE =  basePath + '/cycles/'
  public static readonly GET_CYCLE =  basePath + '/cycles'
  public static readonly POST_CYCLE =  basePath + '/cycles'
  // career-controller
  public static readonly GETID_CARRER = basePath + '/careers/'
  public static readonly GET_CARRER = basePath + '/careers'
  public static readonly POST_CARRER = basePath + '/careers'
  // housing-material-controller
  public static readonly GETID_HOUSING_MATERIAL = basePath + '/medical-histories/housing-materials/'
  public static readonly GET_HOUSING_MATERIAL = basePath + '/medical-histories/housing-materials'
  public static readonly POST_HOUSING_MATERIAL = basePath + '/medical-histories/housing-materials'
  // auth-controller
  public static readonly POST_AUTH = basePath + '/auth/register'
  public static readonly POSTB_AUTH = basePath + '/auth/register'
  //person controller
  public static readonly GETID_PERSON = basePath + '/persons/'
  public static readonly GET_PERSON = basePath + '/persons'
  public static readonly POST_PERSON = basePath + '/persons'
   // grupos
   public static readonly GETID_GROUPS = basePath + '/groups/'
   public static readonly GET_GROUPS = basePath + '/groups'
   public static readonly POST_GROUPS = basePath + '/groups'
   // semestres
   public static readonly GETID_SEMESTER = basePath + '/semesters/'
   public static readonly GET_SEMESTER = basePath + '/semesters'
   public static readonly POST_SEMESTER = basePath + '/semesters'
   // region measurement pockets
   public static readonly GETID_REGION_MEASUREMENT_POCKETS = basePath + '/medical-histories/region-measurement-pockets/'
   public static readonly GET_REGION_MEASUREMENT_POCKETS = basePath + '/medical-histories/region-measurement-pockets'
   public static readonly POST_REGION_MEASUREMENT_POCKETS = basePath + '/medical-histories/region-measurement-pockets'
   // pocket measurement detail 
   public static readonly GETID_POCKET_MEASUREMENT_DETAIL = basePath + '/medical-histories/pocket-measurement-details/'
   public static readonly GET_POCKET_MEASUREMENT_DETAIL = basePath + '/medical-histories/region-measurement-pockets'
   public static readonly POST_POCKET_MEASUREMENT_DETAIL = basePath + '/medical-histories/region-measurement-pockets'
   // periodontograma
    public static readonly GETID_PERIODONTOGRAM = basePath + '/medical-histories/periodontograms/'
    public static readonly GET_PERIODONTOGRAM = basePath + '/medical-histories/periodontograms'
    public static readonly POST_PERIODONTOGRAM = basePath + '/medical-histories/periodontograms'
    // open question pathological antecedentes
    public static readonly GETID_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/open-question-pathological-antecedents/'
    public static readonly GET_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/open-question-pathological-antecedents'
    public static readonly POST_OPEN_QUESTION_PATHOLOGICAL_ANTECEDENTS = basePath + '/medical-histories/open-question-pathological-antecedents'
    // vital-signs-controller
    public static readonly GETID_VITAL_SIGNS = basePath + '/medical-histories/vital-signs/{id}'
    public static readonly GET_VITAL_SIGNS = basePath + '/medical-histories/vital-signs'
    public static readonly POST_VITAL_SIGNS = basePath + '/medical-histories/vital-signs'
    // religion-controller
    public static readonly GETID_RELIGION = basePath + '/patients/religion/'
    public static readonly GET_RELIGION =  basePath + '/patients/religion'  
    // nationality-controller
    public static readonly GET_NACIONALITY = basePath + '/patients/nationality'
    // occupation-controller
    public static readonly GET_OCUPATION = basePath + '/patients/occupations'
    // marital-status-controller
    public static readonly GET_MARITAL_STATUS = basePath + '/patients/marital-status'
    // ethnic-group-controller
    public static readonly GET_ETHNIC_GROUP = basePath + '/patients/ethnic-groups'
    // locality-controller
    public static readonly GET_LOCALITIES = basePath + '/address/locality'
   // housing-controller
   public static readonly GET_HOUSING = basePath + '/address/housing'
   // street-controller
   public static readonly GET_STREETS = basePath + '/address/streets'
   // neighborhood-controller
   public static readonly GET_NEIGHBORHOODS = basePath + '/addresses/neighborhoods'
  


}
