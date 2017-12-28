// Interesting parameters to tweak!
const SMOOTHING = 0.8;

export abstract class Visualizer {
    private analyser: AnalyserNode;
    private freqs: Uint8Array;
    private times: Uint8Array;
    private drawContext: CanvasRenderingContext2D;
    private drawFunc: (freqs: Uint8Array, times: Uint8Array, drawContext: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

    constructor(private canvas: HTMLCanvasElement, private audioContext: AudioContext, fftSize: number = 2048) {
        this.drawContext = canvas.getContext("2d");
        this.analyser = audioContext.createAnalyser();
        this.drawFunc = () => { return; };

        this.analyser.minDecibels = -140;
        this.analyser.maxDecibels = 0;
        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.analyser.fftSize = fftSize;
        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
        this.times = new Uint8Array(this.analyser.frequencyBinCount);
    }

    public connect(sound: HTMLAudioElement): void {
        const source = this.audioContext.createMediaElementSource(sound);
        source.connect(this.audioContext.destination);
        source.connect(this.analyser);
    }

    public draw(): void {
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.analyser.getByteFrequencyData(this.freqs);
        this.analyser.getByteTimeDomainData(this.times);

        this.drawFunc(this.freqs, this.times, this.drawContext, this.canvas);

        requestAnimationFrame(this.draw.bind(this));
    }

    public set drawFunction(func: (freqs: Uint8Array, times: Uint8Array, drawContext: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void) {
        this.drawFunc = func;
    }

    public init(): void {
        this.draw();
    }
}
