import {DTO} from "./dto";
import {makeAutoObservable} from 'mobx'


export interface IList extends DTO {
  id?: string;
  description?: string;
  owner?: {
    [id: string]: boolean;
  };
}


export class List implements IList {
  id?: string;
  description: string;
  owner: { [id: string]: boolean; } = {};

  constructor(data: IList) {
    this.id = data.id;
    this.description = data.description || "";
    this.owner = data.owner || {};

    makeAutoObservable(this);
  }
}
