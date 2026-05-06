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
import { Firestore, doc, setDoc } from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';
import { AuthConnect, IAuthUser, ProfileChange } from '../model/auth';
import { vapidKey } from '../firebase.config';

function toIAuthUser(user: User): IAuthUser {
  return {
    uid: user.uid,
    isAnonymous: user.isAnonymous,
    email: user.email,
    displayName: user.displayName,
  };
}

export class AuthService {
  constructor(public db: Firestore, public auth: Auth) { }

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

  async requestNotificationPermission(uid: string): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging();
      const token = await getToken(messaging, { vapidKey });
      await setDoc(doc(this.db, 'fcmTokens', uid), { token });
    }
    return permission;
  }
}
