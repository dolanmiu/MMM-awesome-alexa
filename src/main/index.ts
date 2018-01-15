import { Request, Response } from "express";
import * as fs from "fs";
import * as NodeHelper from "node_helper";
import * as path from "path";

import { AudioService, TokenService } from "./alexa-voice-service";
import { ConfigService } from "./config-service";
import { AlexaModels } from "./models";
import { RendererCommunicator } from "./renderer-communicator";
import { AlexaStateMachine } from "./states/alexa-state-machine";

const checkConfig = (uncheckedConfig: UncheckedConfig): Config => {
    if (!uncheckedConfig.clientId) {
        throw new Error("clientId must be defined");
    }

    if (!uncheckedConfig.clientSecret) {
        throw new Error("clientSecret must be defined");
    }

    if (!uncheckedConfig.deviceId) {
        throw new Error("deviceId must be defined");
    }

    if (!uncheckedConfig.refreshToken) {
        throw new Error("refreshToken must be defined");
    }

    if (!uncheckedConfig.wakeWord) {
        throw new Error("wakeWord must be defined");
    }

    return {
        wakeWord: uncheckedConfig.wakeWord,
        clientId: uncheckedConfig.clientId,
        clientSecret: uncheckedConfig.clientSecret,
        deviceId: uncheckedConfig.deviceId,
        refreshToken: uncheckedConfig.refreshToken,
        lite: uncheckedConfig.lite || false,
        isSpeechVisualizationEnabled: uncheckedConfig.isSpeechVisualizationEnabled || false,
    };
};

module.exports = NodeHelper.create({
    start(): void {
        this.expressApp.get("/output.mpeg", (req: Request, res: Response): void => {
            res.setHeader("Expires", new Date().toUTCString());
            const outputPath = path.resolve(__dirname, "temp/output.mpeg");

            if (!fs.existsSync(outputPath)) {
                fs
                    .createReadStream(
                        path.resolve(__dirname, "resources/alexa/sorry-im-not-sure.mpeg"),
                    )
                    .pipe(res);
                return;
            }

            fs.createReadStream(outputPath).pipe(res);
        });
    },

    socketNotificationReceived<T>(notification: NotificationType, payload: T): void {
        if (notification === "CONFIG") {
            const config = checkConfig(payload);
            const configService = new ConfigService(config);
            this.rendererCommunicator = new RendererCommunicator();
            this.alexaStateMachine = new AlexaStateMachine({
                audioService: new AudioService(),
                configService: configService,
                rendererSend: (event: NotificationType, callbackPayload: object) => {
                    this.sendSocketNotification(event, callbackPayload);
                },
                rendererCommunicator: this.rendererCommunicator,
                models: new AlexaModels(config.wakeWord),
            });

            const tokenService = new TokenService({
                refreshToken: config.refreshToken,
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                deviceId: config.deviceId,
                redirectUrl: "",
            });

            tokenService.Observable.subscribe(token => {
                configService.Config.accessToken = token.access_token;
            });
            return;
        }

        this.rendererCommunicator.sendNotification(notification);
    },
});
