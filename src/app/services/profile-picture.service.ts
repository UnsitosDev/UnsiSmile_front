import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  private profilePictureUpdatedSource = new Subject<string | null>();
  profilePictureUpdated = this.profilePictureUpdatedSource.asObservable();

  updateProfilePicture(newProfilePicture: string | null) {
    this.profilePictureUpdatedSource.next(newProfilePicture);
  }
}
