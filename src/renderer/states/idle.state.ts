import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class IdleState extends State {

    constructor(components: IStateMachineComponents) {
        super(components, "idle");
    }

    public onEnter(): void {
        this.components.div.classList.remove("wrapper-active");
        document.body.classList.remove("down-size");
    }

    public onExit(): void {
        // Not Needed
    }

    public broadcast(type: NotificationType, data: any): void {
        this.transition(this.allowedStateTransitions.get("listening"));
    }
}
