"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alexa_voice_service_1 = require("./alexa-voice-service");
const config_service_1 = require("./config-service");
const models_1 = require("./models");
const rec_tester_1 = require("./rec-tester");
const renderer_communicator_1 = require("./renderer-communicator");
const alexa_state_machine_1 = require("./states/alexa-state-machine");
class Main {
    constructor(uncheckedConfig, rendererSend) {
        const config = this.checkConfig(uncheckedConfig);
        const configService = new config_service_1.ConfigService(config);
        this.rendererCommunicator = new renderer_communicator_1.RendererCommunicator();
        this.alexaStateMachine = this.createStateMachine(configService, rendererSend);
        this.recTester = new rec_tester_1.RecTester();
        const tokenService = new alexa_voice_service_1.TokenService({
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
    receivedNotification(type, payload) {
        this.rendererCommunicator.sendNotification(type);
    }
    createStateMachine(configService, rendererSend) {
        const models = new models_1.AlexaModels(configService.Config.wakeWord);
        const audioService = new alexa_voice_service_1.AudioService();
        const alexaStateMachine = new alexa_state_machine_1.AlexaStateMachine({
            audioService: audioService,
            configService: configService,
            rendererSend: rendererSend,
            rendererCommunicator: this.rendererCommunicator,
            models: models,
        });
        return alexaStateMachine;
    }
    checkConfig(uncheckedConfig) {
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
exports.default = Main;
module.exports = Main;
