import { } from "../alexa-voice-service";
import { AlexaDetector } from "../detector";
import { Recorder } from "../recorder";
import { State } from "./base.state";
import { IdleState } from "./idle.state";
import { ListeningState } from "./listening.state";
import { SpeakingState } from "./speaking.state";

export interface IStateMachineComponents {
    recorder: Recorder;
    detector: AlexaDetector;
}

export class AlexaStateMachine {
    private currentState: State;
    private idleState: IdleState;
    private listeningState: ListeningState;
    private speakingState: SpeakingState;

    constructor(components: IStateMachineComponents) {
        this.idleState = new IdleState(components);
        this.listeningState = new ListeningState(components);
        this.speakingState = new SpeakingState(components);

        this.idleState.AllowedStateTransitions = new Map<StateName, State>([["listening", this.listeningState]]);
        this.listeningState.AllowedStateTransitions = new Map<StateName, State>([["speaking", this.speakingState], ["idle", this.idleState]]);
        this.speakingState.AllowedStateTransitions = new Map<StateName, State>([["idle", this.idleState]]);

        this.currentState = this.idleState;
        this.currentState.onEnter();
    }

    public get CurrentState(): State {
        return this.currentState;
    }
}
