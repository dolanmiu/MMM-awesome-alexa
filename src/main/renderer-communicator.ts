import { Observable, Subject } from "rxjs/Rx";

export class RendererCommunicator {
    private subject: Subject<NotificationType>;

    constructor() {
        this.subject = new Subject<NotificationType>();
    }

    public sendNotification(type: NotificationType): void {
        this.subject.next(type);
    }

    public get Observable(): Observable<NotificationType> {
        return this.subject.asObservable();
    }
}
