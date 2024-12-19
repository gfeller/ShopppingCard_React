import {Message, Severity} from "../model/message";
import {makeAutoObservable} from "mobx"; 

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

    constructor() {
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
