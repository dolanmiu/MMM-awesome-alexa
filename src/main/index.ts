import { AudioService, TokenService } from "./alexa-voice-service";
import { ConfigService } from "./config-service";
import { AlexaDetector } from "./detector";
import { AlexaModels, MODELS } from "./models";
import { Recorder } from "./recorder";
import { AlexaStateMachine } from "./states/alexa-state-machine";

const cwd = process.env.PWD + "/modules/MMM-awesome-alexa";

export default class Main {
    private alexaStateMachine: AlexaStateMachine;

    constructor(uncheckedConfig: UncheckedConfig, rendererSend: (event: string, payload: object) => void) {
        const config = this.checkConfig(uncheckedConfig);
        const configService = new ConfigService(config);
        this.alexaStateMachine = this.createStateMachine(configService, rendererSend);

        const tokenService = new TokenService({
            refreshToken: config.refreshToken,
            clientId: config.clientId,
            clientSecret: "10aa15ddc1a0fc1ff3c4afdd6ad0f259546b8942d75c50fcd5990bb12ff5ab5a",
            deviceId: "dolan_alexa_test",
            redirectUrl: "http://localhost:4200/authresponse",
        });

        tokenService.Observable.subscribe((token) => {
            console.log(token);
            configService.Config.accessToken = token.access_token;
        });
    }

    private createStateMachine(configService: ConfigService, rendererSend: (event: string, payload: object) => void): AlexaStateMachine {
        const models = this.createAlexaModels(configService.Config);
        const detector = new AlexaDetector(models, cwd);
        const recorder = new Recorder(cwd);
        const audioService = new AudioService(cwd);

        detector.start();

        const alexaStateMachine = new AlexaStateMachine({
            detector: detector,
            recorder: recorder,
            audioService: audioService,
            configService: configService,
            cwd: cwd,
            rendererSend: rendererSend,
        });

        return alexaStateMachine;
    }

    private createAlexaModels(config: Config): AlexaModels {
        let modelConfig = MODELS[config.wakeWord];
        if (modelConfig === undefined) {
            console.error(`model ${config.wakeWord} is not found, so using Alexa instead`);
            modelConfig = MODELS.Alexa;
        }

        const models = new AlexaModels(cwd, modelConfig);

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
