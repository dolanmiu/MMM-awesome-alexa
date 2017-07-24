import { AudioService, TokenService } from "./alexa-voice-service";
import { ConfigService } from "./config-service";
import { AlexaModels } from "./models";
import { RecTester } from "./rec-tester";
import { RendererCommunicator } from "./renderer-communicator";
import { AlexaStateMachine } from "./states/alexa-state-machine";

export default class Main {
    private recTester: RecTester;
    private alexaStateMachine: AlexaStateMachine;
    private rendererCommunicator: RendererCommunicator;

    constructor(uncheckedConfig: UncheckedConfig, rendererSend: (event: string, payload: object) => void) {
        const config = this.checkConfig(uncheckedConfig);
        const configService = new ConfigService(config);
        this.rendererCommunicator = new RendererCommunicator();
        this.alexaStateMachine = this.createStateMachine(configService, rendererSend);
        this.recTester = new RecTester();

        const tokenService = new TokenService({
            refreshToken: config.refreshToken,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            deviceId: config.deviceId,
            redirectUrl: "",
        });

        tokenService.Observable.subscribe((token) => {
            configService.Config.accessToken = token.access_token;
        });

        // this.recTester.test();
    }

    public receivedNotification<T>(type: NotificationType, payload: T): void {
        this.rendererCommunicator.sendNotification(type);
    }

    private createStateMachine(configService: ConfigService, rendererSend: (event: NotificationType, payload: object) => void): AlexaStateMachine {
        const models = new AlexaModels(configService.Config.wakeWord);
        const audioService = new AudioService();

        const alexaStateMachine = new AlexaStateMachine({
            audioService: audioService,
            configService: configService,
            rendererSend: rendererSend,
            rendererCommunicator: this.rendererCommunicator,
            models: models,
        });

        return alexaStateMachine;
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
            lite: uncheckedConfig.lite ? uncheckedConfig.lite : false,
        };
    }
}

module.exports = Main;
