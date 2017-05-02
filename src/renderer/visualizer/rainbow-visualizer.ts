import { Visualizer } from "./visualizer";

const WIDTH = 640;
const HEIGHT = 360;

export class RainbowVisualizer extends Visualizer {

    public init(): void {
        super.init();
        this.drawFunction = (freqs, times, drawContext) => {
            // Draw the frequency domain chart.
            for (let i = 0; i < freqs.length; i++) {
                const value = freqs[i];
                const percent = value / 256;
                const height = HEIGHT * percent;
                const offset = HEIGHT - height - 1;
                const barWidth = WIDTH / freqs.length;
                const hue = i / freqs.length * 360;

                drawContext.fillStyle = "hsl(" + hue + ", 100%, 50%)";
                drawContext.fillRect(i * barWidth, offset, barWidth, height);
            }

            // Draw the time domain chart.
            for (let i = 0; i < times.length; i++) {
                const value = times[i];
                const percent = value / 256;
                const height = HEIGHT * percent;
                const offset = HEIGHT - height - 1;
                const barWidth = WIDTH / times.length;

                drawContext.fillStyle = "white";
                drawContext.fillRect(i * barWidth, offset, 1, 2);
            }
        };
    }
}
