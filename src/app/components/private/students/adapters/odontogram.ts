import { Arcade } from './../../../../models/shared/odontogram/odontogram.model';
import { OdontogramResponse } from '@mean/models';
import { IOdontogramHandler, ITooth, IFace, ICondition } from 'src/app/models/shared/odontogram/odontogram';

// Map a odotogram response to a IOdontogramHandler
export function mapOdontogramResponseToOdontogramData(
  response: OdontogramResponse,
  base_odontogram: IOdontogramHandler
): IOdontogramHandler {
  // Helper function to map conditions
  const mapConditions = (conditions: any[]): ICondition[] => {
    return conditions.map((cond) => ({
      ...cond,
      idCondition: Number(cond.condition),
    }));
  };

  // Helper function to map faces
  const mapFaces = (faces: any[]): IFace[] => {
    return faces.map((face) => ({
      ...face,
      idFace: String(face.idFace),
      conditions: mapConditions(face.conditions),
    }));
  };

  // Helper function to map teeth
  const mapTeeth = (teeth: any[]): ITooth[] => {
    return teeth.map((tooth) => ({
      ...tooth,
      idTooth: Number(tooth.idTooth),
      status: true,
      conditions: mapConditions(tooth.conditions),
      faces: mapFaces(tooth.faces),
    }));
  };

  // Helper function to merge teeth
  const mergeTeeth = (baseTeeth: ITooth[], responseTeeth: ITooth[]): ITooth[] => {
    return baseTeeth.map((baseTooth) => {
      const responseTooth = responseTeeth.find((tooth) => tooth.idTooth === baseTooth.idTooth);
      if (responseTooth) {
        return {
          ...baseTooth,
          ...responseTooth,
          faces: mergeFaces(baseTooth.faces, responseTooth.faces),
        };
      }
      return baseTooth;
    });
  };

  // Helper function to merge faces
  const mergeFaces = (baseFaces: IFace[], responseFaces: IFace[]): IFace[] => {
    return baseFaces.map((baseFace) => {
      const responseFace = responseFaces.find((face) => face.idFace === baseFace.idFace);
      if (responseFace) {
        return {
          ...baseFace,
          ...responseFace,
        };
      }
      return baseFace;
    });
  };

  // Map child arcade teeth
  const childArcadeTeeth = mapTeeth(response.childArcade);
  base_odontogram.childrenArcade.teeth = mergeTeeth(base_odontogram.childrenArcade.teeth, childArcadeTeeth);

  // Map adult arcade teeth
  const adultArcadeTeeth = mapTeeth(response.adultArcade);
  base_odontogram.adultArcade.teeth = mergeTeeth(base_odontogram.adultArcade.teeth, adultArcadeTeeth);

  return base_odontogram;
}