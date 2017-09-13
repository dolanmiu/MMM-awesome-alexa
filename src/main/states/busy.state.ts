import * as fs from "fs";
import { Subscription } from "rxjs/Rx";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class BusyState extends State {
    private rendererSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "busy");
    }

    public onEnter(): void {
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

    public onExit(): void {
        this.rendererSubscription.unsubscribe();
    }
}
