import {DTO} from "./dto";

export interface IList extends DTO {
  id?: string;
  description?: string;
  owner?: {
    [id: string]: boolean;
  };
}
