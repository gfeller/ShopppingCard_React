import {
  Auth,
  EmailAuthProvider,
  User,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { AuthConnect, IAuthUser, ProfileChange } from '../model/auth';

function toIAuthUser(user: User): IAuthUser {
  return {
    uid: user.uid,
    isAnonymous: user.isAnonymous,
    email: user.email,
    displayName: user.displayName,
  };
}

export class AuthService {
  constructor(public auth: Auth) { }

  onAuthChange(cb: (user: IAuthUser | null) => void): () => void {
    return this.auth.onAuthStateChanged((user: User | null) => {
      cb(user ? toIAuthUser(user) : null);
    });
  }

  signInAnonymously(): Promise<void> {
    return signInAnonymously(this.auth).then(() => undefined);
  }

  connectUser(data: AuthConnect): Promise<void> {
    const user = this.auth.currentUser!;
    return linkWithCredential(
      user,
      EmailAuthProvider.credential(data.email, data.pwd)
    ).then((cred) => {
      // caller receives the updated user via onAuthChange
      void cred;
    });
  }

  login(data: AuthConnect): Promise<void> {
    return signInWithEmailAndPassword(this.auth, data.email, data.pwd).then(
      () => undefined
    );
  }

  resetPwdMail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  async updateProfile(data: ProfileChange): Promise<void> {
    const currentUser = this.auth.currentUser!;
    if (data.displayName !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName: data.displayName, photoURL: '' });
    }
  }

  async updatePassword(email: string, pwdOld: string, pwd: string): Promise<void> {
    const currentUser = this.auth.currentUser!;
    const cred = EmailAuthProvider.credential(email, pwdOld);
    await reauthenticateWithCredential(currentUser, cred);
    await updatePassword(currentUser, pwd);
  }
}
