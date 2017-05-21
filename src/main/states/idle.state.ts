import { Subscription } from "rxjs/Subscription";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class IdleState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "idle");
    }

    public onEnter(): void {
        console.log("now in idle state");
        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case DETECTOR.Hotword:
                    this.transition(this.allowedStateTransitions.get("listening"));
                    break;
            }
        });
    }

    public onExit(): void {
        this.detectorSubscription.unsubscribe();
    }
}
