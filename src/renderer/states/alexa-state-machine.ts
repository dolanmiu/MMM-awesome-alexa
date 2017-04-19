import { AVSWrapper } from "../avs-wrapper";
import { VADWrapper } from "../vad-wrapper";
import { Visualizer } from "../visualizer/visualizer";
import { State } from "./base.state";
import { IdleState } from "./idle.state";
import { ListeningState } from "./listening.state";
import { SpeakingState } from "./speaking.state";

export interface IStateMachineComponents {
    avs: AVSWrapper;
    vad: VADWrapper;
    visualizer: Visualizer;
    div: HTMLElement;
}
export class AlexaStateMachine {
    private currentState: State;
    private idleState: IdleState;
    private listeningState: ListeningState;
    private speakingState: SpeakingState;

    constructor(private components: IStateMachineComponents) {
        this.idleState = new IdleState(components);
        this.listeningState = new ListeningState(components);
        this.speakingState = new SpeakingState(components);

        this.idleState.AllowedStateTransitions = new Map<StateName, State>([["listening", this.listeningState]]);
        this.listeningState.AllowedStateTransitions = new Map<StateName, State>([["speaking", this.speakingState], ["idle", this.idleState]]);
        this.speakingState.AllowedStateTransitions = new Map<StateName, State>([["idle", this.idleState]]);

        this.currentState = this.idleState;

        this.setupStateEvents(this.currentState);
    }

    public get CurrentState(): State {
        return this.currentState;
    }

    public broadcast(type: NotificationType, data: any): void {
        this.currentState.broadcast(type, data);
    }

    private setupStateEvents(state: State): void {
        this.currentState.onStateChange((newState) => {
            this.currentState = newState;
            this.setupStateEvents(this.currentState);
        });
    }
}
