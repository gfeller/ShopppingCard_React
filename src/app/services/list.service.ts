import { IList } from '../model/list';
import { BaseService } from './base.service';
import { Auth } from 'firebase/auth';
import {
  Firestore,
  Unsubscribe,
  addDoc,
  doc,
  onSnapshot,
  setDoc,
  where,
} from 'firebase/firestore';

export class ListService extends BaseService<IList> {
  constructor(db: Firestore, public afAuth: Auth) {
    super('list', db);
  }

  subscribeToLists(uid: string, onChange: (lists: IList[]) => void): Unsubscribe {
    const query = this.collectionQuery(where(`owner.${uid}`, '==', true));
    return onSnapshot(query, { includeMetadataChanges: true }, (snapshot) => {
      const lists = snapshot.docs.map((change) => ({
        ...change.data(),
        id: change.id,
      }));
      onChange(lists);
    });
  }

  async addList(description: string): Promise<void> {
    const currentUser = this.afAuth.currentUser!;
    await addDoc(this.collection, {
      description,
      owner: { [currentUser.uid]: true },
    });
  }

  async addShareList(listId: string): Promise<void> {
    const currentUser = this.afAuth.currentUser!;
    await setDoc(
      doc(this.db, `list/${listId}`),
      { owner: { [currentUser.uid]: true } },
      { merge: true }
    );
  }

  async removeShareList(listId: string): Promise<void> {
    const currentUser = this.afAuth.currentUser!;
    await setDoc(
      doc(this.db, `list/${listId}`),
      { owner: { [currentUser.uid]: false } },
      { merge: true }
    );
  }
}
