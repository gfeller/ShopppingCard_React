import {List} from "../model/list";
import {makeAutoObservable, IObservableArray, observable} from "mobx";
import {Item} from "../model/item";

export class RootStore {
    itemStore: ItemStore
    listStore: ListStore;
    constructor() {
        new List
        this.itemStore = new ItemStore(this)
        this.listStore = new ListStore(this)
    }
}

class ItemStore{
    public items : {[key: string] : Item} = observable({});


    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);
    }

    add(items : Item[]) {
        items.map(x => {
            this.items[x.id!] = x;
        })
    }

    remove(items : Item[]) {
        items.map(x => {
            // check;
            // @ts-ignore
            this.items.remove(x.id);
        })
    }
}

class ListStore {
    public items : IObservableArray<List> = observable([]);
    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);
    }

    setList(items: List[]) {
        this.items.replace(items)
    }
}
