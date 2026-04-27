import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, Firestore, query, QueryCompositeFilterConstraint, QueryConstraint, Unsubscribe, updateDoc, } from "firebase/firestore";
import { DTO } from "../model/dto";

export abstract class BaseService<T extends DTO> {


  protected constructor(protected collectionName: string, protected db: Firestore) { }



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

  collectionQueryComposite(filter: QueryCompositeFilterConstraint) {
    const baseCollection = this.collection;
    return query<T, T>(
      baseCollection,
      filter
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
