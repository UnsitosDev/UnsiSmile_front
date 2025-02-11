import { OdontogramResponse } from '@mean/models';
import { IOdontogramHandler } from 'src/app/models/shared/odontogram/odontogram';
//map a odotogram response to a IOdontogramHandler
function mapOdontogramResponseToOdontogramData(
  response: OdontogramResponse
): IOdontogramHandler {
  return {
    marked: {
      idCondition: 0,
      condition: '',
      description: '',
    },
    childrenArcade: {
      teeth: response.childArcade.map((arcade) => ({
        ...arcade,
        idTooth: Number(arcade.idTooth),
        status: true,
        conditions: arcade.conditions.map((cond) => ({
            ...cond,
            idCondition: Number(cond.condition),
          })),
        faces: arcade.faces.map((face) => ({
          ...face,
          idFace: String(face.idFace),
          conditions: face.conditions.map((cond) => ({
            ...cond,
            idCondition: Number(cond.condition),
          })),
        })),
      })),
    },
    adultArcade: {
      teeth: response.adultArcade.map((arcade) => ({
        ...arcade,
        idTooth: Number(arcade.idTooth),
        status: true,
        conditions: arcade.conditions.map((cond) => ({
            ...cond,
            idCondition: Number(cond.condition),
          })),
        faces: arcade.faces.map((face) => ({
          ...face,
          idFace: String(face.idFace),
          conditions: face.conditions.map((cond) => ({
            ...cond,
            idCondition: Number(cond.condition),
          })),
        })),
      })),
    },
  };
}
