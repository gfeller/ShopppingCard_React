import {RootStore} from "../state/root-store";

export class OnlineService {

    constructor(private rootStore: RootStore) {


    }

    init(){
        this.rootStore.uiStore.online = navigator.onLine;

        window.addEventListener('offline', () => {
            this.rootStore.uiStore.online =  false;
        });
        window.addEventListener('online', () => {
            this.rootStore.uiStore.online  = true;
        });
    }
}
