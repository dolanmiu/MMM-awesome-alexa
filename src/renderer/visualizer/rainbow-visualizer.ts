import { Visualizer } from "./visualizer";

export class RainbowVisualizer extends Visualizer {
    public start(): void {
        super.start();
        this.drawFunction = (freqs, times, drawContext, canvas) => {
            // Draw the frequency domain chart.
            for (let i = 0; i < freqs.length; i++) {
                const value = freqs[i];
                const percent = value / 256;
                const height = canvas.height * percent;
                const offset = canvas.height - height - 1;
                const barWidth = canvas.width / freqs.length;
                const hue = i / freqs.length * 360;

                drawContext.fillStyle = "hsl(" + hue + ", 100%, 50%)";
                drawContext.fillRect(i * barWidth, offset, barWidth, height);
            }

            // Draw the time domain chart.
            for (let i = 0; i < times.length; i++) {
                const value = times[i];
                const percent = value / 256;
                const height = canvas.height * percent;
                const offset = canvas.height - height - 1;
                const barWidth = canvas.width / times.length;

                drawContext.fillStyle = "white";
                drawContext.fillRect(i * barWidth, offset, 1, 2);
            }
        };
    }
}
