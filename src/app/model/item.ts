import {Timestamp} from "firebase/firestore";
import {DTO} from "./dto";

export interface IItem extends DTO {
  id?: string;
  boughtAt?: Timestamp | null;
  createdAt?: Timestamp;
  createdBy?: string;
  description: string;
  listId: string;
}
