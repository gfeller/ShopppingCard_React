
import {
  Auth,
  deleteUser,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile
} from '@firebase/auth';


import { EmailAuthProvider, User } from 'firebase/auth';
import { AuthConnect, AuthUser } from '../interfaces/auth';
import { Severity } from '../interfaces/message';
import { RootStore } from "../state/root-store";


export class AuthService {
  constructor(public auth: Auth, private rootStore: RootStore) {
    auth.onAuthStateChanged((user: User | null) => {
      if (user === null) {
        signInAnonymously(auth);
      } else {
        rootStore.authStore.setUser(user);
      }
    });
  }



  connectUser(data: AuthConnect) {
    const user = this.auth.currentUser!
    linkWithCredential(user, EmailAuthProvider.credential(data.email, data.pwd))
      .then((usercred) => {

        const user = usercred.user;
        this.rootStore.uiStore.setMessage({ text: 'Account mit Email verbunden.', show: true, severity: Severity.success })
        this.rootStore.authStore.setUser(user);
      }).catch((error) => {
        console.log('test')
        this.rootStore.uiStore.setMessage({ text: 'Account verbindung fehlgeschlagen', show: true, severity: Severity.error })
      });

  }

  login(data: AuthConnect) {
    signInWithEmailAndPassword(this.auth, data.email, data.pwd)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        this.rootStore.uiStore.setMessage({ text: 'Angemeldet', show: true, severity: Severity.success })
        this.rootStore.authStore.setUser(user);
        // ...
      })
      .catch((error) => {
        this.rootStore.uiStore.setMessage({ text: 'Anmeldung fehlgeschlagen', show: true, severity: Severity.error })
      });

  }
  /*

  async delete(data: AuthUserSettingsChange) {
      const cred = EmailAuthProvider.credential(data.email, data.pwdOld);
      const user = await this.afAuth.currentUser;

      await reauthenticateWithCredential(user, cred);
      await deleteUser(user);

      return signInAnonymously(this.afAuth);
  }

  resetPwdMail(email: string): Observable<any> {
      return from(sendPasswordResetEmail(this.afAuth, email));
  }

  changeUser(data: AuthUserSettingsChange): Observable<AuthUser> {
      return defer(async () => {
          const currentUser = await this.afAuth.currentUser;

          if (data.displayName !== currentUser.displayName) {
              await updateProfile(currentUser, {displayName: data.displayName, photoURL: ''});
          }
          if (data.pwd && data.pwdOld) {
              const cred = EmailAuthProvider.credential(data.email, data.pwdOld);
              await reauthenticateWithCredential(currentUser, cred);
              await updatePassword(currentUser, data.pwd);
          }
          return new AuthUser(await this.afAuth.currentUser);
      });
  }*/
}
