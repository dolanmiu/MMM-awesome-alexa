import { AlexaDetector } from "./detector";
import { AlexaModels } from "./models";

const record = require("node-record-lpcm16");

const modulePath = process.env.PWD + "/modules/MMM-alexa-hands-free";

export class Main {
    constructor() {
        console.log("starting init");
        const models = new AlexaModels(modulePath);
        const detector = new AlexaDetector(models, modulePath);

        const mic = record.start({
            threshold: 0,
            verbose: true,
        });
        mic.pipe(detector);

        console.log("success");
    }
}

const main = new Main();