import { Timestamp } from "firebase/firestore";
import { DTO } from "./dto";
import { makeAutoObservable } from "mobx";

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
    makeAutoObservable(this);
  }
}
