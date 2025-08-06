import { ITooth } from 'src/app/shared/models';

export interface ToothEvent {
  faceId: string;
  index: number;
  tooth: ITooth;
}
