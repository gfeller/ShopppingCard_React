export interface IAuthUser {
  uid: string;
  isAnonymous: boolean;
  email: string | null;
  displayName: string | null;
}

export interface AuthConnect {
  email: string;
  pwd: string;
}

export interface ProfileChange {
  displayName: string;
}