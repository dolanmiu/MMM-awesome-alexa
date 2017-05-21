import * as fs from "fs";
import * as path from "path";

import { ConfigService } from "./config-service";
import { AlexaDetector } from "./detector";
import { MODELS } from "./model-dictionary";
import { AlexaModels } from "./models";
import { Recorder } from "./recorder";
import { AlexaStateMachine } from "./states/alexa-state-machine";

import { AudioService, TokenService } from "./alexa-voice-service";

const modulePath = process.env.PWD + "/modules/MMM-awesome-alexa";

export default class Main {
    private alexaStateMachine: AlexaStateMachine;

    constructor(uncheckedConfig: UncheckedConfig) {
        ConfigService.config = this.checkConfig(uncheckedConfig);
        this.alexaStateMachine = this.createStateMachine();

        const f = new TokenService({
            refreshToken: ConfigService.config.refreshToken,
            clientId: ConfigService.config.clientId,
            clientSecret: "10aa15ddc1a0fc1ff3c4afdd6ad0f259546b8942d75c50fcd5990bb12ff5ab5a",
            deviceId: "dolan_alexa_test",
            redirectUrl: "http://localhost:4200/authresponse",
        });
        const audioService = new AudioService();

        f.Observable.subscribe((token) => {
            ConfigService.config.accessToken = token.access_token;
            const file = fs.createReadStream(path.join(__dirname, "../../hello.wav"));
            audioService.sendAudio(token.access_token, file).then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    private createStateMachine(): AlexaStateMachine {
        const models = this.createAlexaModels();
        const detector = new AlexaDetector(models, modulePath);
        const recorder = new Recorder(modulePath);
        detector.start();

        const alexaStateMachine = new AlexaStateMachine({
            detector: detector,
            recorder: recorder,
        });

        return alexaStateMachine;
    }

    private createAlexaModels(): AlexaModels {
        let modelConfig = MODELS[ConfigService.config.wakeWord];
        if (modelConfig === undefined) {
            console.error(`model ${ConfigService.config.wakeWord} is not found, so using Alexa instead`);
            modelConfig = MODELS.Alexa;
        }

        const models = new AlexaModels(modulePath, modelConfig);

        return models;
    }

    private checkConfig(uncheckedConfig: UncheckedConfig): Config {
        if (uncheckedConfig.clientId === undefined) {
            throw new Error("clientId must be defined");
        }

        if (uncheckedConfig.clientSecret === undefined) {
            throw new Error("clientSecret must be defined");
        }

        if (uncheckedConfig.deviceId === undefined) {
            throw new Error("deviceId must be defined");
        }

        if (uncheckedConfig.refreshToken === undefined) {
            throw new Error("refreshToken must be defined");
        }

        if (uncheckedConfig.wakeWord === undefined) {
            throw new Error("wakeWord must be defined");
        }

        return {
            wakeWord: uncheckedConfig.wakeWord,
            clientId: uncheckedConfig.clientId,
            clientSecret: uncheckedConfig.clientSecret,
            deviceId: uncheckedConfig.deviceId,
            refreshToken: uncheckedConfig.refreshToken,
        };
    }
}

module.exports = Main;
