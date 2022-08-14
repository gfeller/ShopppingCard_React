export class AuthUser {
  public uid: string;
  public isAnonymous: boolean;
  public email: string | null;
  public displayName: string;

  constructor({ uid, isAnonymous, email, displayName }: { uid: string, isAnonymous: boolean, email: string, displayName: string }) {
    this.uid = uid;
    this.isAnonymous = isAnonymous;
    this.email = email;
    this.displayName = displayName;
  }
}
export interface AuthConnect {
  email: string;
  pwd: string;
}