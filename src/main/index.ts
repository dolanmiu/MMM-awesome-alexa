import * as record from "node-record-lpcm16";

// import { AVSWrapper } from "./avs-wrapper";
import { AlexaDetector } from "./detector";
import { MODELS } from "./model-dictionary";
import { AlexaModels } from "./models";
import { AlexaStateMachine } from "./states/alexa-state-machine";
import { VADWrapper } from "./vad-wrapper";

const modulePath = process.env.PWD + "/modules/MMM-awesome-alexa";

export default class Main {
    private alexaStateMachine: AlexaStateMachine;

    constructor(config: Config, callback: () => void) {
        this.alexaStateMachine = this.createStateMachine(config);

        let modelConfig = MODELS[config.wakeWord];
        if (modelConfig === undefined) {
            console.error(`model ${config.wakeWord} is not found, so using Alexa instead`);
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

    private createStateMachine(config: Config): AlexaStateMachine {
        // const avsWrapper = new AVSWrapper(config);
        const vadWrapper = new VADWrapper();

        const alexaStateMachine = new AlexaStateMachine({
            avs: undefined,
            vad: vadWrapper,
        });

        // avsWrapper.init();
        vadWrapper.init();

        return alexaStateMachine;
    }
}

module.exports = Main;
