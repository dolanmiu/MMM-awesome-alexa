declare module "alexa-voice-service" {
    enum EventTypes {
        RECORD_STOP, RECORD_START, ERROR, TOKEN_INVALID, LOG, LOGIN, LOGOUT, TOKEN_SET, REFRESH_TOKEN_SET
    }

    interface AVSParams {
        debug: boolean,
        clientId: string,
        clientSecret: string,
        deviceId: string,
        refreshToken: string,
    }

    class Player {
        /*enum EventTypes {
            LOG, ERROR, PLAY, REPLAY, PAUSE, STOP, ENQUEUE, DEQUE
        }*/
    }

    class AVS {
        constructor(params: AVSParams);
    }

   // export = AVS
}
