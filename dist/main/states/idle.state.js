"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const record = require("node-record-lpcm16");
const detector_1 = require("../detector");
const base_state_1 = require("./base.state");
class IdleState extends base_state_1.State {
    constructor(components) {
        super(components, "idle");
    }
    onEnter() {
        this.components.rendererSend("idle", {});
        this.components.detector = new detector_1.HotwordDetector(this.components.models);
        this.components.mic = this.createMic();
        // tslint:disable-next-line:no-any
        this.components.mic.pipe(this.components.detector);
        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case 1 /* Hotword */:
                    this.transition(this.allowedStateTransitions.get("listening"));
                    break;
            }
        });
    }
    onExit() {
        this.detectorSubscription.unsubscribe();
    }
    createMic() {
        const mic = record.start({
            threshold: 0,
            verbose: false,
        });
        return mic;
    }
}
exports.IdleState = IdleState;
