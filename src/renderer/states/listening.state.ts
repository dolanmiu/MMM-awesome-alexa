import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class ListeningState extends State {

    constructor(components: IStateMachineComponents) {
        super(components, "listening");
    }

    public onEnter(): void {
        this.components.avs.startRecording();
        this.components.div.classList.add("wrapper-active");
        document.body.classList.add("down-size");
    }

    public broadcast(type: NotificationType, data: any): void {
        // Do nothing, already in listrning state
    }
}
