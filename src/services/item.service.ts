import { Item } from "../model/item";

import { BaseService } from "./base.service";

import {
  Firestore,
  onSnapshot,
  Timestamp,
  where,
  DocumentChange,
} from "firebase/firestore";
import { RootStore } from "../state/root-store";
import firebase from "firebase/compat";
import moment from "moment";

export class ItemService extends BaseService<Item> {
  constructor(
    private rootStore: RootStore,
    db: Firestore,
    public afAuth: firebase.auth.Auth
  ) {
    super("list", db);
  }

  getFromList(id?: string) {
    this.clearSubscription();

    // debugger;
    if (!id) {
      this.rootStore.itemStore.clear();
      return;
    }
    const query = this.collectionQuery(
      where("listId", "==", id),
      where("boughtAt", "==", null)
    );

    this.addSubscription(
      onSnapshot(query, (items) => {
        this.listChanged(id, items.docChanges()); // TODO
      })
    );

    const query2 = this.collectionQuery(
      where("listId", "==", id),
      where("boughtAt", ">", moment().subtract(1, "days").toDate())
    );

    this.addSubscription(
      onSnapshot(query2, (items) => {
        this.listChanged(id, items.docChanges());
      })
    );
  }

  async add(item: Item) {
    item = { ...item };
    item.boughtAt = null;
    item.createdAt = Timestamp.now();
    item.createdBy = this.afAuth.currentUser!.uid;
    delete item.id;
    return super.add(item);
  }

  listChanged(id: string, items: DocumentChange<Item>[]) {
    let type: string = "";
    let counter = -1;
    const toSend: DocumentChange<Item>[][] = [];

    for (const item of items) {
      if (type !== item.type) {
        counter++;
        toSend[counter] = [];
        type = item.type;
      }
      toSend[counter].push(item);
    }
    for (const action of toSend.filter((x) => x.length > 0)) {
      if (action[0].type === "added" || action[0].type === "modified") {
        this.rootStore.itemStore.add(
          action.map(
            (item) => ({ id: item.doc.id, ...item.doc.data() } as Item)
          )
        );
      } else if (action[0].type === "removed") {
        this.rootStore.itemStore.remove(
          action.map(
            (item) => ({ id: item.doc.id, ...item.doc.data() } as Item)
          )
        );
      }
    }
  }
}
