import { Detector, Models } from "snowboy";

export class AlexaDetector extends Detector {

    constructor(models: Models, cwd: string, hotWordDetectedCallback: () => void = () => {return; }) {

        super({
            resource: cwd + "/resources/common.res",
            models: models,
            audioGain: 2.0,
        });

        this.on("silence", () => {
            // console.log("silence");
        });

        this.on("sound", () => {
            // console.log("sound");
        });

        this.on("error", () => {
            // console.log("error");
        });

        this.on("hotword", (index, hotword) => {
            console.log("hotword", index, hotword);
            hotWordDetectedCallback();
        });
    }
}
