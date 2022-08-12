import { List } from "../model/list";
import {
  makeAutoObservable,
  IObservableArray,
  observable,
  autorun,
} from "mobx";
import { Item } from "../model/item";
import { ListService } from "../services/list.service";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import firebase from "firebase/compat";
import { createContext, useContext } from "react";
import { AuthService } from "../services/auth.service";
import { ItemService } from "../services/item.service";
import { OnlineService } from "../services/online.service";
import { Message, Severity } from "../interfaces/message";

const firebaseConfig = {
  apiKey: "AIzaSyBYzkfzpJ4t1AvyNWZKSwr2vF4laPa9v-8",
  authDomain: "ikaufzetteli.firebaseapp.com",
  databaseURL: "https://ikaufzetteli.firebaseio.com",
  projectId: "ikaufzetteli",
  storageBucket: "ikaufzetteli.appspot.com",
  messagingSenderId: "477279744354",
  appId: "1:477279744354:web:2fff0adf68cbc535bdbc3b",
};

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
  uiStore: UIStore;

  constructor() {
    const db = getFirestore(app);
    const auth = getAuth(app);

    this.listService = new ListService(
      this,
      db,
      auth as unknown as firebase.auth.Auth
    ); // TODO
    this.itemService = new ItemService(
      this,
      db,
      auth as unknown as firebase.auth.Auth
    ); // TODO

    this.listStore = new ListStore(this);
    this.itemStore = new ItemStore(this);

    this.authStore = new AuthStore(this);
    this.authService = new AuthService(auth, this);

    this.onlineService = new OnlineService(this);
    this.uiStore = new UIStore(this);
  }
}

class ItemStore {
  public items: { [key: string]: Item } = observable({});

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);

    autorun(() => {
      // debugger;
      rootStore.itemService.getFromList(rootStore.listStore.currentListId);
    });
  }

  add(items: Item[]) {
    items.forEach((x) => {
      this.items[x.id!] = x;
    });
  }

  remove(items: Item[]) {
    items.forEach((x) => {
      delete this.items[x.id!];
    });
  }

  clear() {
    this.items = {}; // TODO .clear()
  }
}

class ListStore {
  public currentListId?: string;
  public items: IObservableArray<List> = observable([]);
  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  setCurrentList(id: string | undefined) {
    this.currentListId = id;
  }

  setList(items: List[]) {
    this.items.replace(items);
  }
}

export class AuthStore {
  public currentUser?: User;
  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  setUser(user: User) {
    this.currentUser = user;
  }
}

export class UIStore {
  public online: boolean;
  public showListEdit: boolean;
  public message: Message;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.online = navigator.onLine;
    this.showListEdit = false;
    this.message = { show: false, text: "", severity: Severity.info };
  }

  setOnlineStatus(status: boolean) {
    this.online = status;
  }

  toggleListEdit() {
    this.showListEdit = !this.showListEdit;
  }

  setMessage(message: Message) {
    this.message = message;
  }
  resetMessage = () => {
    this.message.show = false;
    this.message.text = "false";
  };
}

export const RootContext = createContext<RootStore>({} as RootStore);
export const StoreRootProvider = RootContext.Provider;
export const useRootStore = (): RootStore => useContext(RootContext);
