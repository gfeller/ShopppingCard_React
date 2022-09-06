import {Message, Severity} from "../interfaces/message";
import {makeAutoObservable} from "mobx";
import {RootStore} from "./root-store";

export class UiStore {
    private _online: boolean = true;

    get online(): boolean {
        return this._online;
    }

    set online(value: boolean) {
        this._online = value;
    }

    public showListEdit: boolean = false;
    public notificationAccess: boolean = false;

    public readonly message: Message = {show: false, text: "", severity: Severity.info};

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this);

    }

    toggleListEdit() {
        this.showListEdit = !this.showListEdit;
    }

    setMessage(message: Omit<Message, "show">) {
        this.message.show = true;
        this.message.severity = message.severity;
        this.message.text = message.text;
    }

    resetMessage = () => {
        this.message.show = false;
    };

    setNotificationAccess(access: boolean) {
        this.notificationAccess = access;
    }
}
