import { AVSWrapper } from "../avs-wrapper";
import { VADWrapper } from "../vad-wrapper";
import { Visualizer } from "../visualizer/visualizer";
import { State } from "./base.state";

export class IdleState extends State {

    constructor(avsWrapper: AVSWrapper, vadWrapper: VADWrapper, visualizer: Visualizer) {
        super(avsWrapper, vadWrapper, visualizer);
    }

    public transitionTo(state: State): void {
        if (!this.canTransition(state)) {
            console.error(`Invalid transition to state: ${state}`);
            return;
        }

        this.avsWrapper.stopRecording();
    }
}
