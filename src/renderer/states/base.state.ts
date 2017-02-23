import { AVSWrapper } from "../avs-wrapper";
import { VADWrapper } from "../vad-wrapper";
import { Visualizer } from "../visualizer/visualizer";

export abstract class State {
    protected allowedStateTransitions: State[];

    constructor(protected avsWrapper: AVSWrapper, protected vadWrapper: VADWrapper, protected visualizer: Visualizer) {
        this.allowedStateTransitions = [];
    }

    public abstract transitionTo(state: State): void;

    protected canTransition(state: State): boolean {
        if (this.allowedStateTransitions.includes(state)) {
            return true;
        } else {
            return false;
        }
    }

    public set AllowedStateTransitions(states: State[]) {
        this.allowedStateTransitions = states;
    }
}
