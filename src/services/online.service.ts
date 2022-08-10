import { RootStore } from "../state/root-store";

export class OnlineService {

    constructor(private rootStore: RootStore) {
    window.addEventListener('offline', (e) => { rootStore.uiStore.setOnlineStatus(false) });
    window.addEventListener('online', (e) => { rootStore.uiStore.setOnlineStatus(true) });
    }

  }