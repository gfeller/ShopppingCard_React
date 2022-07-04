import {List} from '../model/list';
import {BaseService} from './base.service';

import {addDoc, doc, Firestore, onSnapshot, setDoc, where} from 'firebase/firestore';

import firebase from "firebase/compat";

import {RootStore} from "../state/root-store";


export class ListService extends BaseService<List> {


  constructor(rootStore: RootStore, db: Firestore, public afAuth: firebase.auth.Auth) {
    super('list', db);


    afAuth.onAuthStateChanged((user) => {
      if (user !== null) {
        this.clearSubscription();
        const query = this.collectionQuery(where(`owner.${user.uid}`, '==', true));
        this.addSubscription(onSnapshot(query, {includeMetadataChanges: true}, (lists) => {
          const results = lists.docs.map(change => ({
            ...change.data() as List,
            id: change.id,
          }));
          rootStore.listStore.setList(results);

        }));
      }
    });
  }

  async addList(description: string) {
    const currentUser = await this.afAuth.currentUser;
    return addDoc(this.collection, {description, owner: {[currentUser!.uid]: true}});
  }


  async addShareList(listId: string) {
    const currentUser = await this.afAuth.currentUser;
    return setDoc(doc(this.db, `list/${listId}`), {owner: {[currentUser!.uid]: true}}, {merge: true});
  }

  async removeShareList(listId: string) {
    const currentUser = await this.afAuth.currentUser;
    return setDoc(doc(this.db, `list/${listId}`), {owner: {[currentUser!.uid]: false}}, {merge: true});
  }
}
