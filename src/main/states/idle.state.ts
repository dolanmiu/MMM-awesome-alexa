import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class IdleState extends State {

    constructor(components: IStateMachineComponents) {
        super(components, "idle");
    }

    public onEnter(): void {
        // Todo
    }

    public onExit(): void {
        // Not Needed
    }

    public broadcast<T>(type: NotificationType, data: T): void {
        this.transition(this.allowedStateTransitions.get("listening"));
    }
}
