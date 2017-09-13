import * as fs from "fs";
import * as record from "node-record-lpcm16";
import { Subscription } from "rxjs/Rx";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class ListeningState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "listening");
    }

    public onEnter(): void {
        this.components.rendererSend("listening", {});
        const writeStream = fs.createWriteStream(`${process.env.CWD}/temp/to-amazon.wav`);
        writeStream.on("finish", () => {
            this.transition(this.allowedStateTransitions.get("busy"));
        });
        this.components.mic.pipe(writeStream);

        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case DETECTOR.Silence:
                    record.stop();
                    break;
            }
        });

        setTimeout(() => {
            record.stop();
        }, 5000);
    }

    public onExit(): void {
        this.detectorSubscription.unsubscribe();
    }
}
