import * as fs from "fs";
import { Subscription } from "rxjs/Subscription";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class ListeningState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "listening");
    }

    public onEnter(): void {
        this.components.rendererSend("listening", {});
        // this.components.recorder.start();
        const writeStream = fs.createWriteStream(`${process.env.CWD}/temp/to-amazon.wav`);
        writeStream.on("finish", () => {
            this.transition(this.allowedStateTransitions.get("busy"));
        });
        this.components.micHandler.Mic.pipe(writeStream);

        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case DETECTOR.Silence:
                    this.components.micHandler.stop();
                    break;
            }
        });
    }

    public onExit(): void {
        this.detectorSubscription.unsubscribe();
    }
}
