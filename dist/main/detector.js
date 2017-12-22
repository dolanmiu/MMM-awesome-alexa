"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = require("rxjs/Rx");
const snowboy_1 = require("snowboy");
class HotwordDetector extends snowboy_1.Detector {
    constructor(models) {
        super({
            resource: `${process.env.CWD}/resources/common.res`,
            models: models,
            audioGain: 2.0,
        });
        this.subject = new Rx_1.Subject();
        this.setUp();
    }
    setUp() {
        this.on("hotword", () => {
            this.hotwordStartAt = Date.now();
            this.subject.next(1 /* Hotword */);
        });
        this.on("sound", () => {
            if (this.hotwordStartAt) {
                this.hasSaidSomething = true;
            }
        });
        this.on("silence", () => {
            if (this.hasSaidSomething || Date.now() - this.hotwordStartAt > 5000) {
                this.subject.next(0 /* Silence */);
                this.hotwordStartAt = undefined;
                this.hasSaidSomething = false;
            }
        });
        this.on("error", console.error);
    }
    get Observable() {
        return this.subject.asObservable();
    }
}
exports.HotwordDetector = HotwordDetector;
