"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const base_state_1 = require("./base.state");
class BusyState extends base_state_1.State {
    constructor(components) {
        super(components, "busy");
    }
    onEnter() {
        this.components.rendererSend("busy", {});
        const readStream = fs.createReadStream(`${process.env.CWD}/temp/to-amazon.wav`);
        const accessToken = this.components.configService.Config.accessToken;
        this.components.audioService.sendAudio(accessToken, readStream).then((result) => {
            this.components.rendererSend("speak", {});
        }).catch((err) => {
            console.error(err);
        });
        this.rendererSubscription = this.components.rendererCommunicator.Observable.subscribe((type) => {
            if (type === "finishedSpeaking") {
                this.transition(this.allowedStateTransitions.get("idle"));
            }
        });
    }
    onExit() {
        this.rendererSubscription.unsubscribe();
    }
}
exports.BusyState = BusyState;
