import {addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, Firestore, query, QueryConstraint, Unsubscribe, updateDoc,} from "firebase/firestore";
import {DTO} from "../model/dto";

export abstract class BaseService<T extends DTO> {
  private subscription: Unsubscribe[] = [];

  protected constructor(protected collectionName: string, protected db: Firestore) {}

  clearSubscription() {
    this.subscription.forEach((x) => x());
    this.subscription = [];
  }

  addSubscription(subscription: Unsubscribe) {
    this.subscription.push(subscription);
  }

  get collection() {
    return collection(this.db, this.collectionName) as CollectionReference<T, T>; // HACK because no collection<T, T>
  }

  collectionQuery(...queryConstraints: QueryConstraint[]) {
    const baseCollection = this.collection;
    return query<T, T>(
        baseCollection,
        ...queryConstraints
    );
  }

  getDoc(id: string) {
    return doc<T, T>(this.collection, `${id}`);
  }

  async add(item: T) {
    return addDoc(this.collection, item as DocumentData);
  }

  update(item: T) {
    const doc = this.getDoc(item.id!);
    return updateDoc(doc, item as DocumentData);
  }

  remove(id: string) {
    return deleteDoc(this.getDoc(id));
  }
}
