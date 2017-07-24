// import { RainbowVisualizer } from "./visualizer/rainbow-visualizer";
// import { Visualizer } from "./visualizer/visualizer";

export class AlexaMirror {
    // private visualizer: Visualizer;

    constructor(private mainDiv: HTMLElement, canvas: HTMLCanvasElement, private lite: boolean, private mainSend: (event: NotificationType, payload: object) => void) {
        // this.visualizer = new RainbowVisualizer(canvas, this.avsWrapper.AudioContext);

        if (!this.lite) {
            this.mainDiv.classList.add("wrapper-smooth");
            document.body.classList.add("body-smooth");
        }
    }

    public start(): void {
        // this.visualizer.init();
    }

    public receivedNotification<T>(type: NotificationType, payload: T): void {
        switch (type) {
            case "idle":
                this.idle();
                break;
            case "listening":
                this.listening();
                break;
            case "busy":
                break;
            case "speak":
                this.speaking();
                break;
        }
    }

    public listening(): void {
        if (!this.lite) {
            this.mainDiv.classList.add("wrapper-active");
            document.body.classList.add("down-size");
        } else {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    }

    public idle(): void {
        if (!this.lite) {
            this.mainDiv.classList.remove("wrapper-active");
            document.body.classList.remove("down-size");
        }
    }

    public speaking(): void {
        const sound = new Audio("/output.mpeg");
        sound.play();
        sound.addEventListener("ended", () => {
            this.mainSend("finishedSpeaking", {});
        });

        if (this.lite) {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        }
    }
}
