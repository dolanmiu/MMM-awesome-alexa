import { Visualizer } from "./visualizer";

export class CircleVisualizer extends Visualizer {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 32);
    }

    public init(): void {
        super.init();
        this.drawFunction = (freqs, times, drawContext, canvas) => {
            const frequency = freqs[0];
            const scaledFrequency = frequency / 10;
            drawContext.beginPath();
            drawContext.arc(canvas.width / 2, canvas.height / 2, scaledFrequency, 0, 2 * Math.PI);
            drawContext.fillStyle = "white";
            drawContext.fill();
        };
    }
}
