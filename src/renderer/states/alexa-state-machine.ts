import { AVSWrapper } from "../avs-wrapper";
import { VADWrapper } from "../vad-wrapper";
import { Visualizer } from "../visualizer/visualizer";
import { State } from "./base.state";
import { IdleState } from "./idle.state";
import { ListeningState } from "./listening.state";
import { SpeakingState } from "./speaking.state";

export class AlexaStateMachine {
    private currentState: State;
    private idleState: IdleState;
    private listeningState: ListeningState;
    private speakingState: SpeakingState;

    constructor(avsWrapper: AVSWrapper, vadWrapper: VADWrapper, visualizer: Visualizer) {
        this.idleState = new IdleState(avsWrapper, vadWrapper, visualizer);
        this.listeningState = new ListeningState(avsWrapper, vadWrapper, visualizer);
        this.speakingState = new SpeakingState(avsWrapper, vadWrapper, visualizer);

        this.idleState.AllowedStateTransitions = [this.listeningState];
        this.listeningState.AllowedStateTransitions = [this.speakingState, this.idleState];
        this.speakingState.AllowedStateTransitions = [this.idleState];

        this.currentState = this.idleState;
    }

    public get CurrentState(): State {
        return this.currentState;
    }
}
