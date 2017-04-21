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
        this.components.vad.onStopCallback = () => {
            setTimeout(() => {
                this.transitionTo(this.allowedStateTransitions.get("speaking"));
            }, 2000);
        };
    }

    public onExit(): void {
        this.components.vad.onStopCallback = undefined;
    }

    public broadcast(type: NotificationType, data: any): void {
        // Do nothing, already in listrning state
    }
}
