import { Subscription } from "rxjs/Subscription";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class ListeningState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "listening");
    }

    public onEnter(): void {
        this.components.recorder.start();
        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case DETECTOR.Silence:
                    this.transition(this.allowedStateTransitions.get("speaking"));
                    break;
            }
        });
    }

    public onExit(): void {
        this.components.recorder.stop();
        this.detectorSubscription.unsubscribe();
    }
}
