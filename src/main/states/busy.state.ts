import { ConfigService } from "../config-service";
import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class BusyState extends State {

    constructor(components: IStateMachineComponents) {
        super(components, "speaking");
    }

    public onEnter(): void {
        this.components.audioService.sendAudio()
        /*this.components.avs.stopRecording().then(() => {
            this.transition(this.allowedStateTransitions.get("idle"));
        });*/
    }

    public onExit(): void {
        // Clean up
    }
}
