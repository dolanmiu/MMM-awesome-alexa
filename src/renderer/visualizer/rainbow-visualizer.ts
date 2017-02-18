import { Visualizer } from "./visualizer";

const WIDTH = 640;
const HEIGHT = 360;

export class RainbowVisualizer extends Visualizer {

    public init(): void {
        super.init();
        this.drawFunction = (freqs, times, drawContext) => {
            // Draw the frequency domain chart.
            for (let i = 0; i < freqs.length; i++) {
                let value = freqs[i];
                let percent = value / 256;
                let height = HEIGHT * percent;
                let offset = HEIGHT - height - 1;
                let barWidth = WIDTH / freqs.length;
                let hue = i / freqs.length * 360;

                drawContext.fillStyle = "hsl(" + hue + ", 100%, 50%)";
                drawContext.fillRect(i * barWidth, offset, barWidth, height);
            }

            // Draw the time domain chart.
            for (let i = 0; i < times.length; i++) {
                let value = times[i];
                let percent = value / 256;
                let height = HEIGHT * percent;
                let offset = HEIGHT - height - 1;
                let barWidth = WIDTH / times.length;

                drawContext.fillStyle = "white";
                drawContext.fillRect(i * barWidth, offset, 1, 2);
            }
        };
    }
}
