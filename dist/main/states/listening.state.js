"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const record = require("node-record-lpcm16");
const path = require("path");
const base_state_1 = require("./base.state");
class ListeningState extends base_state_1.State {
    constructor(components) {
        super(components, "listening");
    }
    onEnter() {
        this.components.rendererSend("listening", {});
        const writeStream = fs.createWriteStream(path.resolve(__dirname, '../../../temp/to-amazon.wav'));
        writeStream.on("finish", () => {
            this.transition(this.allowedStateTransitions.get("busy"));
        });
        this.components.mic.pipe(writeStream);
        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case 0 /* Silence */:
                    record.stop();
                    break;
            }
        });
    }
    onExit() {
        this.detectorSubscription.unsubscribe();
    }
}
exports.ListeningState = ListeningState;
//# sourceMappingURL=listening.state.js.map