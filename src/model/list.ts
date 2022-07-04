import {DTO} from "./dto";
import { makeAutoObservable } from 'mobx'


export class List implements DTO {
  id?: string;
  description: string = "";
  owner: {
    [id: string]: boolean;
  } = {};

  constructor() {
    makeAutoObservable(this);
  }
}
