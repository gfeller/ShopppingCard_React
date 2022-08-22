import { error } from "console";
import { Auth } from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  Firestore,
  DocumentData,
} from "firebase/firestore";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  Messaging,
  onMessage,
} from "firebase/messaging";
import { RootStore } from "../state/root-store";
import { BaseService } from "./base.service";

interface Token extends DocumentData {
  token: string;
}

export class MessageService {
  constructor(
    public messaging: Messaging,
    private rootStore: RootStore,
    protected db: Firestore
  ) {}

  updateToken(token: string) {
    setDoc(
      doc(this.db, "fcmTokens", this.rootStore.authStore.currentUser!.uid),
      { token }
    );
  }

  requestPermission = () => {
    Notification.requestPermission()
      .then((value: string) => {
        if (value === "default") {
          return Promise.reject(value);
        }
        if (value === "denied") {
          console.log(
            "Benachrichtigen wurden permanent im Browser deaktiviert. Aktivieren Sie diese manuell."
          );
          return Promise.reject(value);
        }
        return getToken(this.messaging);
      })
      .then((token) => {
        this.updateToken(token);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
