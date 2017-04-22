import * as record from "node-record-lpcm16";
import { AlexaDetector } from "./detector";
import { AlexaModels } from "./models";

const modulePath = process.env.PWD + "/modules/MMM-awesome-alexa";

export default class Main {
    constructor(callback: () => void) {
        const models = new AlexaModels(modulePath);
        const detector = new AlexaDetector(models, modulePath, callback);

        const mic = record.start({
            threshold: 0,
            verbose: true,
        });
        mic.pipe(detector);
    }
}

module.exports = Main;
