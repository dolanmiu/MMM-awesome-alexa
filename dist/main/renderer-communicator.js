"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
class RendererCommunicator {
    constructor() {
        this.subject = new Subject_1.Subject();
    }
    sendNotification(type) {
        this.subject.next(type);
    }
    get Observable() {
        return this.subject.asObservable();
    }
}
exports.RendererCommunicator = RendererCommunicator;
