declare module "alexa-voice-service" {
    interface AVSParams {
        debug: boolean,
        clientId: string,
        clientSecret: string,
        deviceId: string,
        refreshToken: string,
    }

    class AVS {
        constructor(params: AVSParams);
    }
}