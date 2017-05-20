import * as record from "node-record-lpcm16";
import { AlexaDetector } from "./detector";
import { MODELS } from "./model-dictionary";
import { AlexaModels } from "./models";

const modulePath = process.env.PWD + "/modules/MMM-awesome-alexa";

export default class Main {
    constructor(wakeWord: string, callback: () => void) {
        let modelConfig = MODELS[wakeWord];

        if (modelConfig === undefined) {
            console.error(`model ${wakeWord} is not found, so using Alexa instead`);
            modelConfig = MODELS.Alexa;
        }

        const models = new AlexaModels(modulePath, modelConfig);
        const detector = new AlexaDetector(models, modulePath, callback);

        const mic = record.start({
            threshold: 0,
            verbose: true,
            
        });
        mic.pipe(detector);
    }
}

module.exports = Main;
