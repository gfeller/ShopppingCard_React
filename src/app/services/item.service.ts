import { IItem } from "../model/item";

import { BaseService } from "./base.service";

import { and, DocumentChange, Firestore, onSnapshot, or, Timestamp, where, } from "firebase/firestore";

import moment from "moment";
import { Auth } from "firebase/auth";

interface ListSubscription {
  onAdd: (items: IItem[]) => void;
  onRemove: (items: IItem[]) => void
}

export class ItemService extends BaseService<IItem> {
  constructor(db: Firestore, public afAuth: Auth) {
    super('list', db);
  }

  subscribeToList(id: string | undefined, callbacks: ListSubscription) {
    const query = this.collectionQueryComposite(
      and(where("listId", "==", id),
        or(
          where("boughtAt", ">", moment().subtract(1, "days").toDate()),
          where("boughtAt", "==", null)
        ))
    );

    return onSnapshot(query, (items) => {
      this.listChanged(items.docChanges(), callbacks);
    });
  }

  async add(item: IItem) {
    item = { ...item };
    item.boughtAt = null;
    item.createdAt = Timestamp.now();
    item.createdBy = this.afAuth.currentUser!.uid;
    delete item.id;
    return super.add(item);
  }

  listChanged(items: DocumentChange<IItem>[], callbacks: ListSubscription) {
    let type = "";
    let counter = -1;
    const toSend: DocumentChange<IItem>[][] = [];

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
        callbacks.onAdd(action.map((item) => (({ id: item.doc.id, ...item.doc.data() }))))
      } else if (action[0].type === "removed") {
        callbacks.onRemove(action.map((item) => (({ id: item.doc.id, ...item.doc.data() }))))
      }
    }
  }
}
