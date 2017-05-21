// import { RainbowVisualizer } from "./visualizer/rainbow-visualizer";
// import { Visualizer } from "./visualizer/visualizer";

export class AlexaMirror {
    // private visualizer: Visualizer;

    constructor(private mainDiv: HTMLElement, canvas: HTMLCanvasElement, config: Config) {
        // this.visualizer = new RainbowVisualizer(canvas, this.avsWrapper.AudioContext);
    }

    public start(): void {
        // this.visualizer.init();
    }

    public receivedNotification<T>(type: NotificationType, payload: T): void {
        // TODO
    }

    public listening(): void {
        this.mainDiv.classList.add("wrapper-active");
        document.body.classList.add("down-size");
    }

    public idle(): void {
        this.mainDiv.classList.remove("wrapper-active");
        document.body.classList.remove("down-size");
    }

}
