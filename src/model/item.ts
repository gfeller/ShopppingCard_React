import {Timestamp} from "firebase/firestore";
import {DTO} from "./dto";
import {makeAutoObservable} from "mobx";


export interface IItem extends DTO {
  id?: string;
  boughtAt?: Timestamp | null;
  createdAt?: Timestamp;
  createdBy?: string;
  description: string;
  listId: string;
}

export class Item implements IItem {
  id?: string;
  boughtAt?: Timestamp | null;
  createdAt?: Timestamp;
  createdBy?: string;
  description: string;
  listId: string;

  constructor(data : IItem) {
    this.id = data.id;
    this.boughtAt = data.boughtAt;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
    this.description = data.description;
    this.listId = data.listId;

    makeAutoObservable(this);
  }
}
