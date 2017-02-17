const WIDTH = 640;
const HEIGHT = 360;

// Interesting parameters to tweak!
const SMOOTHING = 0.8;
const FFT_SIZE = 2048;

declare let window: any;
declare let navigator: any;

export class Visualizer {
    private analyser: AnalyserNode;
    private context: AudioContext;
    private freqs: Uint8Array;
    private times: Uint8Array;
    private startTime: number;
    private startOffset: number;
    private source: AudioBufferSourceNode;

    constructor() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();

        this.analyser.connect(this.context.destination);
        this.analyser.minDecibels = -140;
        this.analyser.maxDecibels = 0;
        loadSounds(this, {
            buffer: "chrono.mp3"
        }, onLoaded);
        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
        this.times = new Uint8Array(this.analyser.frequencyBinCount);

        this.startTime = 0;
        this.startOffset = 0;
    }

    public togglePlayback() {
        this.startTime = this.context.currentTime;
        console.log("started at", this.startOffset);
        this.source = this.context.createBufferSource();
        // Connect graph
        this.source.connect(this.analyser);
        this.source.buffer = this.buffer;
        // Start playback, but make sure we stay in bound of the buffer.
        this.source[this.source.start ? "start" : "noteOn"](0, this.startOffset % this.buffer.duration);
        // Start visualizer.
        requestAnimFrame(this.draw.bind(this));
    }

    public draw(): void {
        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.analyser.fftSize = FFT_SIZE;

        // Get the frequency data from the currently playing music
        this.analyser.getByteFrequencyData(this.freqs);
        this.analyser.getByteTimeDomainData(this.times);

        let canvas = document.querySelector("canvas");
        let drawContext = canvas.getContext("2d");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        // Draw the frequency domain chart.
        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            let value = this.freqs[i];
            let percent = value / 256;
            let height = HEIGHT * percent;
            let offset = HEIGHT - height - 1;
            let barWidth = WIDTH / this.analyser.frequencyBinCount;
            let hue = i / this.analyser.frequencyBinCount * 360;
            drawContext.fillStyle = "hsl(" + hue + ", 100%, 50%)";
            drawContext.fillRect(i * barWidth, offset, barWidth, height);
        }

        // Draw the time domain chart.
        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            let value = this.times[i];
            let percent = value / 256;
            let height = HEIGHT * percent;
            let offset = HEIGHT - height - 1;
            let barWidth = WIDTH / this.analyser.frequencyBinCount;
            drawContext.fillStyle = "white";
            drawContext.fillRect(i * barWidth, offset, 1, 2);
        }

        requestAnimFrame(this.draw.bind(this));
    }
}
