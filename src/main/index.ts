import * as record from "node-record-lpcm16";
import { AlexaDetector } from "./detector";
import { AlexaModels } from "./models";
import { OAuthAutomator } from "./oauth/oauth-automator";

const modulePath = process.env.PWD + "/modules/MMM-alexa-hands-free";

export default class Main {
    constructor(callback: () => void) {
        console.log("starting init");
        const models = new AlexaModels(modulePath);
        const detector = new AlexaDetector(models, modulePath, callback);

        const mic = record.start({
            threshold: 0,
            verbose: true,
        });
        mic.pipe(detector);

        console.log("success");

        const automator = new OAuthAutomator();
        automator.login();
    }
}

module.exports = Main;
