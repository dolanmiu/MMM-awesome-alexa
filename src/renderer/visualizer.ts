const WIDTH = 640;
const HEIGHT = 360;

// Interesting parameters to tweak!
const SMOOTHING = 0.8;
const FFT_SIZE = 2048;

declare let window: any;
declare let navigator: any;

export class Visualizer {
    private analyser: AnalyserNode;
    private freqs: Uint8Array;
    private times: Uint8Array;
    private drawContext: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement, private audioContext: AudioContext) {
        this.drawContext = canvas.getContext("2d");
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.connect(this.audioContext.destination);
        this.analyser.minDecibels = -140;
        this.analyser.maxDecibels = 0;
        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
        this.times = new Uint8Array(this.analyser.frequencyBinCount);
    }

    public play(source: AudioBufferSourceNode) {
        console.log("started at", this.audioContext.currentTime);
        source.connect(this.analyser);
        //this.source.buffer = this.buffer;
        // Start playback, but make sure we stay in bound of the buffer.
        //this.source[this.source.start ? "start" : "noteOn"](0, this.startOffset % this.buffer.duration);
        // Start visualizer.
    }

    public draw(): void {
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.analyser.fftSize = FFT_SIZE;

        // Get the frequency data from the currently playing music
        this.analyser.getByteFrequencyData(this.freqs);
        this.analyser.getByteTimeDomainData(this.times);

        // Draw the frequency domain chart.
        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            let value = this.freqs[i];
            let percent = value / 256;
            let height = HEIGHT * percent;
            let offset = HEIGHT - height - 1;
            let barWidth = WIDTH / this.analyser.frequencyBinCount;
            let hue = i / this.analyser.frequencyBinCount * 360;
            this.drawContext.fillStyle = "hsl(" + hue + ", 100%, 50%)";
            this.drawContext.fillRect(i * barWidth, offset, barWidth, height);
        }

        // Draw the time domain chart.
        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            let value = this.times[i];
            let percent = value / 256;
            let height = HEIGHT * percent;
            let offset = HEIGHT - height - 1;
            let barWidth = WIDTH / this.analyser.frequencyBinCount;
            this.drawContext.fillStyle = "white";
            this.drawContext.fillRect(i * barWidth, offset, 1, 2);
        }

        requestAnimationFrame(this.draw.bind(this));
    }
}
