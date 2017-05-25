import { Subscription } from "rxjs/Subscription";

import { AlexaDetector } from "../detector";
import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class IdleState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "idle");
    }

    public onEnter(): void {
        this.components.rendererSend("idle", {});
        this.components.detector = new AlexaDetector(this.components.models);
        this.components.micHandler.start();
        // tslint:disable-next-line:no-any
        this.components.micHandler.Mic.pipe(this.components.detector as any);
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
