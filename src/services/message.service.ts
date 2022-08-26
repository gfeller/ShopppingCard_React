import {
  setDoc,
  doc,
  collection,
  Firestore,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  deleteToken,
  getToken,
  Messaging,
  onMessage,
} from "firebase/messaging";
import { Severity } from "../interfaces/message";
import { RootStore } from "../state/root-store";

export class MessageService {
  constructor(
    public messaging: Messaging,
    private rootStore: RootStore,
    protected db: Firestore
  ) {
    this.receiveMessage();
  }

  updateToken(token: string) {
    console.log(this.rootStore.authStore.currentUser!.uid);
    setDoc(
      doc(this.db, "fcmTokens", this.rootStore.authStore.currentUser!.uid),
      { token }
    );
  }

  setPermission(permission: boolean) {
    this.rootStore.uiStore.setNotificationAccess(permission);
  }

  async checkToken() {
    const user = this.rootStore.authStore.currentUser;
    if (user)
      console.log(
        await getDoc(doc(collection(this.db, "fcmTokens"), user!.uid))
      );
  }

  async removeToken() {
    const user = this.rootStore.authStore.currentUser;
    deleteDoc(doc(collection(this.db, "fcmTokens"), user!.uid));
    this.rootStore.uiStore.setMessage({
      show: true,
      text: "Erfolgreich abgemeldet.",
      severity: Severity.info,
    });
    this.setPermission(false);
    console.log(Notification.permission);
  }

  requestPermission = () => {
    Notification.requestPermission()
      .then((value: string) => {
        if (value === "default") {
          return Promise.reject(value);
        }
        if (value === "denied") {
          this.rootStore.uiStore.setMessage({
            show: true,
            text: "Benachrichtigen wurden permanent im Browser deaktiviert. Aktivieren Sie diese manuell.",
            severity: Severity.info,
          });
          return Promise.reject(value);
        }
        return getToken(this.messaging);
      })
      .then((token) => {
        this.rootStore.uiStore.setMessage({
          show: true,
          text: "Danke für Ihre Zustimmung.",
          severity: Severity.info,
        });
        this.updateToken(token);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (
          Notification.permission === "default" ||
          Notification.permission === "denied"
        ) {
          this.setPermission(false);
        } else {
          this.setPermission(true);
        }
      });
  };

  async removePermission() {
    await deleteToken(this.messaging);
    await this.removeToken();
  }

  receiveMessage() {
    if (this.messaging != null) {
      onMessage(this.messaging, (payload) => {
        this.rootStore.uiStore.setMessage({
          show: true,
          text: payload.notification?.body as string | "",
          severity: Severity.info,
        });
      });
    }
  }
}
