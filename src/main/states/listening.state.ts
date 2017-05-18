import { Subscription } from "rxjs/Subscription";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class ListeningState extends State {

    private statusSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "listening");
    }

    public onEnter(): void {
        this.components.avs.startRecording();
        this.statusSubscription = this.components.vad.Status.subscribe((status) => {
            if (status !== VadStatus.Stopped) {
                return;
            }

            setTimeout(() => {
                this.transition(this.allowedStateTransitions.get("speaking"));
            }, 2000);
        });
    }

    public onExit(): void {
        this.statusSubscription.unsubscribe();
    }

    public broadcast<T>(type: NotificationType, data: T): void {
        // Do nothing, already in listening state
    }
}
