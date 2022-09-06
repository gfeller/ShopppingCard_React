import {ListService} from "../services/list.service";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {createContext, useContext} from "react";
import {AuthService} from "../services/auth.service";
import {ItemService} from "../services/item.service";
import {OnlineService} from "../services/online.service";
import {MessageService} from "../services/message.service";
import {getMessaging} from "firebase/messaging";
import {firebaseConfig} from "../firebase.config";
import {ItemStore} from "./item-store";
import {ListStore} from "./list-store";
import {AuthStore} from "./auth-store";
import {UiStore} from "./ui-store";


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export class RootStore {
  itemStore: ItemStore;
  listStore: ListStore;
  listService: ListService;
  authStore: AuthStore;
  authService: AuthService;
  itemService: ItemService;
  onlineService: OnlineService;
  uiStore: UiStore;
  messageService: MessageService;

  get init () {
    return this.authStore.currentUser;
  }

  constructor() {
    const db = getFirestore(app);
    const auth = getAuth(app);
    const messaging = getMessaging(app);

    this.listService = new ListService( this, db, auth );
    this.itemService = new ItemService( this, db, auth );

    this.listStore = new ListStore(this);
    this.itemStore = new ItemStore(this);

    this.authStore = new AuthStore(this);
    this.authService = new AuthService(auth, this);

    this.onlineService = new OnlineService(this);
    this.uiStore = new UiStore(this);

    this.onlineService.init();

    this.messageService = new MessageService(messaging, this, db);
  }
}

export const RootContext = createContext<RootStore>({} as RootStore);
export const StoreRootProvider = RootContext.Provider;
export const useRootStore = (): RootStore => useContext(RootContext);
