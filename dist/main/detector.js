"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
const snowboy_1 = require("snowboy");
const Timer = require("timer-machine");
const WAIT_TIME = 700;
class HotwordDetector extends snowboy_1.Detector {
    constructor(models) {
        super({
            resource: `${process.env.CWD}/resources/common.res`,
            models: models,
            audioGain: 2.0,
        });
        this.silenceTimer = new Timer();
        this.subject = new Subject_1.Subject();
        this.setUp();
    }
    setUp() {
        this.on("silence", () => {
            if (this.silenceTimer.isStarted() === false) {
                this.silenceTimer.start();
            }
            if (this.silenceTimer.timeFromStart() > WAIT_TIME) {
                this.subject.next(0 /* Silence */);
            }
        });
        this.on("sound", () => {
            this.silenceTimer.stop();
        });
        this.on("error", (error) => {
            console.error(error);
        });
        this.on("hotword", (index, hotword) => {
            console.log("hotword", index, hotword);
            this.subject.next(1 /* Hotword */);
        });
    }
    get Observable() {
        return this.subject.asObservable();
    }
}
exports.HotwordDetector = HotwordDetector;
