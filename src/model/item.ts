import { Timestamp } from 'firebase/firestore';
import { DTO } from "./dto";
import { makeAutoObservable } from "mobx";
import { uuidv4 } from '@firebase/util';


export class Item implements DTO {
  id?: string;
  boughtAt?: Timestamp | null;
  createdAt?: Timestamp;
  createdBy?: string;
  description: string;
  listId: string;

  constructor(description: string, listId: string) {
    this.description = description;
    this.listId = listId;
    this.id = uuidv4();
    makeAutoObservable(this);
  }
}
