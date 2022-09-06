import {
  Auth,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
} from "@firebase/auth";

import { EmailAuthProvider, User } from "firebase/auth";
import { AuthConnect, AuthUserSettingsChange } from "../interfaces/auth";
import { Severity } from "../interfaces/message";
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
    const user = this.auth.currentUser!;
    linkWithCredential(user, EmailAuthProvider.credential(data.email, data.pwd))
      .then((usercred) => {
        const user = usercred.user;
        this.rootStore.uiStore.setMessage({
          text: "Account mit Email verbunden.",
          severity: Severity.success,
        });
        this.rootStore.authStore.setUser(user);
      })
      .catch((error) => {
        this.rootStore.uiStore.setMessage({
          text: "Account verbindung fehlgeschlagen",
          severity: Severity.error,
        });
      });
  }

  login(data: AuthConnect) {
    signInWithEmailAndPassword(this.auth, data.email, data.pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.rootStore.uiStore.setMessage({
          text: "Angemeldet",
          severity: Severity.success,
        });
        this.rootStore.authStore.setUser(user);
        // ...
      })
      .catch((error) => {
        this.rootStore.uiStore.setMessage({
          text: "Anmeldung fehlgeschlagen",
          severity: Severity.error,
        });
      });
  }

  resetPwdMail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  changeUser(data: AuthUserSettingsChange) {
    return async () => {
      const currentUser = await this.auth.currentUser!;
      const actions = [] as Array<Promise<any>>;

      if (data.displayName !== currentUser.displayName) {
        actions.push(
          updateProfile(currentUser, {
            displayName: data.displayName,
            photoURL: "",
          })
        );
      }
      if (data.pwd && data.pwdOld) {
        const cred = EmailAuthProvider.credential(data.email, data.pwdOld);
        actions.push(reauthenticateWithCredential(currentUser, cred));
        actions.push(updatePassword(currentUser, data.pwd));
      }
      return Promise.all(actions);
    };
  }
}
