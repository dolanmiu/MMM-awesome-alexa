"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = require("rxjs/Rx");
class RendererCommunicator {
    constructor() {
        this.subject = new Rx_1.Subject();
    }
    sendNotification(type) {
        this.subject.next(type);
    }
    get Observable() {
        return this.subject.asObservable();
    }
}
exports.RendererCommunicator = RendererCommunicator;
