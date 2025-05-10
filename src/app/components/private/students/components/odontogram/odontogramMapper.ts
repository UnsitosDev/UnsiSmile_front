import { ICondition, IFace, IOdontogram, ITooth, OdontogramPost, OdontogramResponse } from '@mean/models';

export class OdontogramMapper {
  constructor() {}

  public static mapOdontogramToPost(
    patientId: string,
    odontogram: { observations: string; teeth: ITooth[] },
    idTreatment: number
  ): OdontogramPost {
    return {
      idPatient: patientId,
      observations: odontogram.observations,
      idTreatment: idTreatment,
      teeth: odontogram.teeth.map((tooth: ITooth) => ({
        ...tooth,
        faces: tooth.faces.map((face: IFace) => ({
          ...face,
          idFace: Number(face.idFace),
          conditions: (face.conditions || []).map((condition: ICondition) => ({
            idToothFaceCondition: condition.idCondition,
            condition: condition.condition,
            description: condition.description,
          })),
        })),
      })),
    };
  }


  public static mapOdontogramResponseToData(response: OdontogramResponse): IOdontogram {
    return {
      observations: response.observations,
      teeth: [
        ...response.adultArcade.map((tooth) => ({
          idTooth: Number(tooth.idTooth),
          status: true,
          conditions: tooth.conditions.map((condition) => ({
            idCondition: condition.idCondition,
            condition: condition.condition,
            description: condition.description,
            selected: false,
          })),
          faces: tooth.faces.map((face) => ({
            idFace: String(face.idFace),
            conditions: face.conditions.map((condition) => ({
              idCondition: condition.idToothFaceCondition,
              condition: condition.condition,
              description: condition.description,
              selected: false,
            })),
          })),
        })),
        ...response.childArcade.map((tooth) => ({
          idTooth: Number(tooth.idTooth),
          status: true,
          conditions: tooth.conditions.map((condition) => ({
            idCondition: condition.idCondition,
            condition: condition.condition,
            description: condition.description,
            selected: false,
          })),
          faces: tooth.faces.map((face) => ({
            idFace: String(face.idFace),
            conditions: face.conditions.map((condition) => ({
              idCondition: condition.idToothFaceCondition,
              condition: condition.condition,
              description: condition.description,
              selected: false,
            })),
          })),
        })),
      ],
    };
  }

}
