// import * as AVS from "alexa-voice-service";
const AVS = require("alexa-voice-service");

export class AVSWrapper {
    private avs: any;

    constructor() {
        this.avs = new AVS({
            debug: true,
            clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
            clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
            deviceId: "magic_mirror_alexa",
            deviceSerialNumber: 123,
            redirectUri: `https://${window.location.host}/authresponse`,
        });
        console.log(this.avs);
    }

    public init(): void {
        /*this.avs.getTokenFromCode()
            .then(() => this.avs.refreshToken())
            .then(() => this.avs.requestMic())
            .catch((error: any) => { console.log(error); });*/
    }
}
