import {IObservableArray, makeAutoObservable, observable} from "mobx";
import {List} from "../model/list";
import {RootStore} from "./root-store";

export class ListStore {
    public currentListId?: string;
    public items: IObservableArray<List> = observable([]);

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);
    }

    setCurrentList(id: string | undefined) {
        this.currentListId = id;
    }

    setList(items: List[]) {
        this.items.replace(items);
    }
}
