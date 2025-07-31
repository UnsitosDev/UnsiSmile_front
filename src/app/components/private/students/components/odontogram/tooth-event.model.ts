import { ITooth } from '@mean/models';

export interface ToothEvent {
  faceId: string;
  index: number;
  tooth: ITooth;
}
