import { AVSWrapper } from "./avs-wrapper";
import { AlexaStateMachine } from "./states/alexa-state-machine";
import { VADWrapper } from "./vad-wrapper";
import { RainbowVisualizer } from "./visualizer/rainbow-visualizer";
import { Visualizer } from "./visualizer/visualizer";

export class AlexaMirror {
    private avsWrapper: AVSWrapper;
    private vadWrapper: VADWrapper;
    private visualizer: Visualizer;
    private alexaStateMachine: AlexaStateMachine;

    constructor(mainDiv: HTMLElement, canvas: HTMLCanvasElement, config: Config) {
        this.avsWrapper = new AVSWrapper(config.refreshToken);

        this.vadWrapper = new VADWrapper();
        this.visualizer = new RainbowVisualizer(canvas, this.avsWrapper.AudioContext);
        this.alexaStateMachine = new AlexaStateMachine({
            avs: this.avsWrapper,
            vad: this.vadWrapper,
            visualizer: this.visualizer,
            div: mainDiv,
        });
    }

    public start(): void {
        this.avsWrapper.init();
        this.vadWrapper.init();
        this.visualizer.init();
    }

    public receivedNotification(type: NotificationType, payload: any): void {
        this.alexaStateMachine.broadcast(type, payload);
    }

}
