import { Subscription } from "rxjs/Subscription";

import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class ListeningState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "listening");
    }

    public onEnter(): void {
        this.components.rendererSend("listening", {});
        this.components.recorder.start();
        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case DETECTOR.Silence:
                    if (this.components.recorder.IsStarted === false) {
                        return;
                    }

                    this.components.recorder.stop().then(() => {
                        this.transition(this.allowedStateTransitions.get("busy"));
                    });
                    // this.transition(this.allowedStateTransitions.get("busy"));

                    break;
            }
        });
    }

    public onExit(): void {
        this.detectorSubscription.unsubscribe();
    }
}
