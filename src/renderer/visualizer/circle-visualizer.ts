import { Visualizer } from "./visualizer";

const WIDTH = 640;
const HEIGHT = 360;

export class CircleVisualizer extends Visualizer {

    constructor(canvas: HTMLCanvasElement, audioContext: AudioContext) {
        super(canvas, audioContext, 32);
    }

    public init(): void {
        super.init();
        this.drawFunction = (freqs, times, drawContext) => {
            // TODO
        };
    }
}
