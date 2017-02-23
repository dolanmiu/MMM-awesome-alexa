import { AlexaStateMachine } from "./states/alexa-state-machine";
import { AVSWrapper } from "./avs-wrapper";
import { VADWrapper } from "./vad-wrapper";
import { RainbowVisualizer } from "./visualizer/rainbow-visualizer";
import { Visualizer } from "./visualizer/visualizer";

export class AlexaMirror {
    private avsWrapper: AVSWrapper;
    private vadWrapper: VADWrapper;
    private visualizer: Visualizer;
    private alexaStateMachine: AlexaStateMachine;

    constructor(mainDiv: HTMLElement, canvas: HTMLCanvasElement) {
        this.avsWrapper = new AVSWrapper(() => {
            mainDiv.classList.add("wrapper-active");
            document.body.classList.add("down-size");
        }, () => {
            mainDiv.classList.remove("wrapper-active");
            document.body.classList.remove("down-size");
        }, () => {
            setTimeout(() => {
                this.visualizer.play(this.avsWrapper.Source);
            }, 500);
        });

        this.vadWrapper = new VADWrapper();
        this.visualizer = new RainbowVisualizer(canvas, this.avsWrapper.AudioContext);
        this.alexaStateMachine = new AlexaStateMachine(this.avsWrapper, this.vadWrapper, this.visualizer);
    }

    public start(): void {
        this.avsWrapper.init();

        this.vadWrapper.start(() => {
            if (this.avsWrapper.IsRecording) {
                this.avsWrapper.stopRecording();
            }
        });

        this.visualizer.init();
    }

}
