import { Models, Detector } from "snowboy";

export class AlexaDetector extends Detector {
    constructor(models: Models, cwd: string) {
        console.log("setting up detector");
        super({
            resource: cwd + "/resources/common.res",
            models: models,
            audioGain: 2.0,
        });

        this.on("silence", function () {
            console.log("silence");
        });

        this.on("sound", function () {
            console.log("sound");
        });

        this.on("error", function () {
            console.log("error");
        });

        this.on("hotword", function (index, hotword) {
            console.log("hotword", index, hotword);
        });
    }
}

/*const avs = new AVS({
    debug: true,
    clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
    deviceId: "magic_mirror_alexa",
    deviceSerialNumber: 123,
    redirectUri: `https://${window.location.host}/authresponse`
});*/