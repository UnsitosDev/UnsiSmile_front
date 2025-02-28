export interface ProfileResponse {
  id: string;
  username: string;
  role: {
    idRole: number;
    role: string;
  };
  status: boolean;
  profilePictureId: string;
}
