import * as fs from "fs";
import * as path from "path";
//import * as record from "node-record-lpcm16";

// import { AVSWrapper } from "./avs-wrapper";
//import { AlexaDetector } from "./detector";
//import { MODELS } from "./model-dictionary";
//import { AlexaModels } from "./models";
import { AlexaStateMachine } from "./states/alexa-state-machine";
// import { VADWrapper } from "./vad-wrapper";

import { TokenService, AudioService } from "./alexa-voice-service";

//const modulePath = process.env.PWD + "/modules/MMM-awesome-alexa";

export default class Main {
    private alexaStateMachine: AlexaStateMachine;

    constructor(config: Config, callback: () => void) {
        this.alexaStateMachine = this.createStateMachine(config);

        // let modelConfig = MODELS[config.wakeWord];
        // if (modelConfig === undefined) {
        //     console.error(`model ${config.wakeWord} is not found, so using Alexa instead`);
        //     modelConfig = MODELS.Alexa;
        // }

        // const models = new AlexaModels(modulePath, modelConfig);
        // const detector = new AlexaDetector(models, modulePath, callback);

        // const mic = record.start({
        //     threshold: 0,
        //     verbose: true,
        // });

        // mic.pipe(detector);

        // Do nullcheck on config
        const options = {
            refreshToken: config.refreshToken,
            clientId: config.clientId,
            clientSecret: "10aa15ddc1a0fc1ff3c4afdd6ad0f259546b8942d75c50fcd5990bb12ff5ab5a",
            deviceId: "dolan_alexa_test",
            redirectUrl: "http://localhost:4200/authresponse",
        };

        const f = new TokenService();
        const audioService = new AudioService();

        f.refreshToken(options).then((token) => {
            console.log(token.access_token);
            const file = fs.createReadStream(path.join(__dirname, "../../hello.wav"));
            audioService.sendAudio(token.access_token, file).then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
        });

    }

    private createStateMachine(config: Config): AlexaStateMachine {
        // const avsWrapper = new AVSWrapper(config);
        // const vadWrapper = new VADWrapper();

        const alexaStateMachine = new AlexaStateMachine({});

        // avsWrapper.init();
        // vadWrapper.init();

        return alexaStateMachine;
    }
}

module.exports = Main;
