// import { RainbowVisualizer } from "./visualizer/rainbow-visualizer";
// import { Visualizer } from "./visualizer/visualizer";

interface IConfig {
    lite: boolean;
    isWakeUpSoundEnabled: boolean;
}
export class AlexaMirror {
    // private visualizer: Visualizer;

    constructor(
        private mainDiv: HTMLElement,
        canvas: HTMLCanvasElement,
        private config: IConfig,
        private mainSend: (event: NotificationType, payload: object) => void,
        private alexaCircle: HTMLElement,
    ) {
        // this.visualizer = new RainbowVisualizer(canvas, this.avsWrapper.AudioContext);
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
                this.alexaCircle.classList.add("alexa-circle--busy");
                break;
            case "speak":
                this.speaking();
                break;
        }
    }

    public listening(): void {
        if (this.config.isWakeUpSoundEnabled) {
            const sound = new Audio("/med_ui_wakesound.wav");
            sound.play();
        }
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--listening");
            this.mainDiv.classList.add("wrapper-active");
            this.mainDiv.classList.add("down-size");
        } else {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    }

    public idle(): void {
        if (!this.config.lite) {
            this.mainDiv.classList.remove("wrapper-active");
            this.mainDiv.classList.remove("down-size");
        }
    }

    public speaking(): void {
        const sound = new Audio("/output.mpeg");
        sound.play();
        sound.addEventListener("ended", () => {
            this.mainSend("finishedSpeaking", {});
        });

        if (this.config.lite) {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        }
        this.alexaCircle.classList.remove("alexa-circle--busy", "alexa-circle--listening");
    }
}
