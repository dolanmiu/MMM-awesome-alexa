import * as fs from "fs";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class BusyState extends State {

    constructor(components: IStateMachineComponents) {
        super(components, "speaking");
    }

    public onEnter(): void {
        this.components.rendererSend("busy", {});
        const file = fs.createReadStream(`${this.components.cwd}/temp/to-amazon.wav`);
        const accessToken = this.components.configService.Config.accessToken;

        this.components.audioService.sendAudio(accessToken, file).then((result) => {
            this.components.rendererSend("speak", {});
            // this.transition(this.allowedStateTransitions.get("idle"));
        }).catch((err) => {
            console.error(err);
        });
    }

    public onExit(): void {
        // Clean up
    }
}
