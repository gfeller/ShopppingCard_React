import {Item} from "../model/item";
import {autorun, makeAutoObservable, observable} from "mobx";
import {RootStore} from "./root-store";

export class ItemStore {
    public items: { [key: string]: Item } = observable({});

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);

        autorun(() => {
            if( rootStore.listStore.currentListId)
            {
                rootStore.itemService.getFromList(rootStore.listStore.currentListId)
            }
        });
    }

    add(items: Item[]) {
        items.forEach((x) => {
            this.items[x.id!] = x;
        });
    }

    remove(items: Item[]) {
        items.forEach((x) => {
            delete this.items[x.id!];
        });
    }

    clear() {
        this.items = {};
    }
}
