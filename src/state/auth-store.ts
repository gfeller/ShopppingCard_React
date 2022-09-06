import {User} from "firebase/auth";
import {makeAutoObservable} from "mobx";
import {RootStore} from "./root-store";

export class AuthStore {
    public currentUser?: User;

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);
    }

    setUser(user: User) {
        this.currentUser = {...user};
    }

    get isConnected() {
        return !!this.currentUser?.email;
    }

    get displayName() {
        return (
            this.currentUser?.displayName ||
            this.currentUser?.email ||
            this.currentUser?.uid.substring(0, 10)
        );
    }
}
