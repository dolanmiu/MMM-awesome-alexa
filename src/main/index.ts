import { AudioService, TokenService } from "./alexa-voice-service";
import { ConfigService } from "./config-service";
import { AlexaDetector } from "./detector";
import { MicHandler } from "./mic-handler";
import { AlexaModels } from "./models";
import { Recorder } from "./recorder";
import { RendererCommunicator } from "./renderer-communicator";
import { AlexaStateMachine } from "./states/alexa-state-machine";

export default class Main {
    private alexaStateMachine: AlexaStateMachine;
    private rendererCommunicator: RendererCommunicator;

    constructor(uncheckedConfig: UncheckedConfig, rendererSend: (event: string, payload: object) => void) {
        const config = this.checkConfig(uncheckedConfig);
        const configService = new ConfigService(config);
        this.rendererCommunicator = new RendererCommunicator();
        this.alexaStateMachine = this.createStateMachine(configService, rendererSend);

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
    }

    public receivedNotification<T>(type: NotificationType, payload: T): void {
        this.rendererCommunicator.sendNotification(type);
    }

    private createStateMachine(configService: ConfigService, rendererSend: (event: NotificationType, payload: object) => void): AlexaStateMachine {
        const models = new AlexaModels(configService.Config.wakeWord);
        const micHandler = new MicHandler();
        const detector = new AlexaDetector(micHandler, models);
        const recorder = new Recorder(micHandler);
        const audioService = new AudioService();

        micHandler.start();
        detector.start();

        const alexaStateMachine = new AlexaStateMachine({
            detector: detector,
            recorder: recorder,
            audioService: audioService,
            configService: configService,
            rendererSend: rendererSend,
            rendererCommunicator: this.rendererCommunicator,
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
        };
    }
}

module.exports = Main;
