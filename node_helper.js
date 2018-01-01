module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("rxjs/Rx");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class State {
    constructor(components, name) {
        this.components = components;
        this.name = name;
        this.allowedStateTransitions = new Map();
    }
    transition(state) {
        if (!this.canTransition(state)) {
            console.error(`Invalid transition to state: ${state}`);
            return;
        }
        console.log(`transiting to state: ${state.name}`);
        this.onExit();
        state.onEnter();
    }
    canTransition(state) {
        return this.allowedStateTransitions.has(state.name);
    }
    set AllowedStateTransitions(states) {
        this.allowedStateTransitions = states;
    }
}
exports.State = State;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("snowboy");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("node-record-lpcm16");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(1);
const path = __webpack_require__(0);
const alexa_voice_service_1 = __webpack_require__(8);
const config_service_1 = __webpack_require__(11);
const models_1 = __webpack_require__(12);
const renderer_communicator_1 = __webpack_require__(15);
const alexa_state_machine_1 = __webpack_require__(16);
const checkConfig = (uncheckedConfig) => {
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
    start() {
        this.expressApp.get("/output.mpeg", (req, res) => {
            res.setHeader("Expires", new Date().toUTCString());
            const outputPath = path.resolve(__dirname, "temp/output.mpeg");
            if (!fs.existsSync(outputPath)) {
                fs
                    .createReadStream(path.resolve(__dirname, "resources/alexa/sorry-im-not-sure.mpeg"))
                    .pipe(res);
                return;
            }
            fs.createReadStream(outputPath).pipe(res);
        });
    },
    socketNotificationReceived(notification, payload) {
        if (notification === "CONFIG") {
            const config = checkConfig(payload);
            const configService = new config_service_1.ConfigService(config);
            this.rendererCommunicator = new renderer_communicator_1.RendererCommunicator();
            this.alexaStateMachine = new alexa_state_machine_1.AlexaStateMachine({
                audioService: new alexa_voice_service_1.AudioService(),
                configService: configService,
                rendererSend: (event, callbackPayload) => {
                    this.sendSocketNotification(event, callbackPayload);
                },
                rendererCommunicator: this.rendererCommunicator,
                models: new models_1.AlexaModels(config.wakeWord),
            });
            const tokenService = new alexa_voice_service_1.TokenService({
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var audio_service_1 = __webpack_require__(9);
exports.AudioService = audio_service_1.AudioService;
var token_service_1 = __webpack_require__(10);
exports.TokenService = token_service_1.TokenService;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Reference: https://developer.amazon.com/public/solutions/alexa/alexa-voice-service/rest/speechrecognizer-recognize-request
const fs = __webpack_require__(1);
const path = __webpack_require__(0);
const request = __webpack_require__(4);
const url = "https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize";
class AudioService {
    sendAudio(token, file) {
        const stream = fs.createWriteStream(path.resolve(__dirname, "temp/output.mpeg"));
        return new Promise((resolve, reject) => {
            request.post({
                uri: url,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                formData: {
                    metadata: {
                        value: JSON.stringify({
                            messageHeader: {},
                            messageBody: {
                                profile: "alexa-close-talk",
                                locale: "en-us",
                                format: "audio/L16; rate=16000; channels=1",
                            },
                        }),
                        options: {
                            "Content-Disposition": 'form-data; name="metadata"',
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                    },
                    audio: {
                        value: file,
                        options: {
                            "Content-Type": "audio/L16; rate=16000; channels=1",
                            "Content-Disposition": 'form-data; name="audio"',
                        },
                    },
                },
            }, (err, response, body) => {
                if (err !== null) {
                    reject(err);
                    return;
                }
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(body);
                    return;
                }
            }).pipe(stream);
            stream.on("finish", () => {
                if (stream.bytesWritten === 0) {
                    fs.unlink(path.resolve(__dirname, "temp/output.mpeg"), () => {
                        resolve();
                    });
                    return;
                }
                resolve();
            });
        });
    }
}
exports.AudioService = AudioService;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const request = __webpack_require__(4);
const Rx_1 = __webpack_require__(2);
class TokenService {
    constructor(options) {
        this.observable = new Rx_1.Observable(observer => {
            if (options.redirectUrl === undefined) {
                throw new Error("redirectUrl required");
            }
            this.obtainToken(options)
                .then(token => {
                observer.next(token);
            })
                .catch(err => {
                throw new Error(err);
            });
            setInterval(() => {
                this.obtainToken(options)
                    .then(token => {
                    observer.next(token);
                })
                    .catch(err => {
                    throw new Error(err);
                });
            }, 3000 * 1000);
        });
    }
    obtainToken(options) {
        return new Promise((resolve, reject) => {
            const grantType = "refresh_token";
            const postData = `grant_type=${grantType}&refresh_token=${options.refreshToken}&client_id=${options.clientId}&client_secret=${options.clientSecret}&redirect_uri=${encodeURIComponent(options.redirectUrl)}`;
            request.post({
                uri: "https://api.amazon.com/auth/o2/token",
                json: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: postData,
            }, (err, response, body) => {
                if (err !== null) {
                    reject(err);
                    return;
                }
                if (response.statusCode !== undefined &&
                    (response.statusCode < 200 || response.statusCode >= 300)) {
                    reject(body);
                    return;
                }
                resolve(body);
            });
        });
    }
    get Observable() {
        return this.observable;
    }
}
exports.TokenService = TokenService;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ConfigService {
    constructor(config) {
        this.config = config;
    }
    get Config() {
        return this.config;
    }
}
exports.ConfigService = ConfigService;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = __webpack_require__(13);
exports.AlexaModels = models_1.AlexaModels;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(0);
const snowboy_1 = __webpack_require__(5);
const model_dictionary_1 = __webpack_require__(14);
class AlexaModels extends snowboy_1.Models {
    constructor(wakeWord) {
        super();
        let model = model_dictionary_1.MODELS[wakeWord];
        if (model === undefined) {
            console.error(`model ${wakeWord} is not found, so using Alexa instead`);
            model = model_dictionary_1.MODELS.Alexa;
        }
        this.add({
            file: path.resolve(__dirname, "resources/models", model.file),
            sensitivity: "0.5",
            hotwords: model.name,
        });
    }
}
exports.AlexaModels = AlexaModels;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const MODELS = {
    "Alexa": {
        file: "alexa.umdl",
        name: "alexa",
    },
    "Jarvis": {
        file: "jarvis.umdl",
        name: "jarvis",
    },
    "Smart Mirror": {
        file: "smart-mirror.umdl",
        name: "smart mirror",
    },
    "Computer": {
        file: "computer.umdl",
        name: "computer",
    },
    "Snowboy": {
        file: "snowboy.umdl",
        name: "snowboy",
    },
};
exports.MODELS = MODELS;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = __webpack_require__(2);
class RendererCommunicator {
    constructor() {
        this.subject = new Rx_1.Subject();
    }
    sendNotification(type) {
        this.subject.next(type);
    }
    get Observable() {
        return this.subject.asObservable();
    }
}
exports.RendererCommunicator = RendererCommunicator;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const busy_state_1 = __webpack_require__(17);
const idle_state_1 = __webpack_require__(18);
const listening_state_1 = __webpack_require__(20);
class AlexaStateMachine {
    constructor(components) {
        this.idleState = new idle_state_1.IdleState(components);
        this.listeningState = new listening_state_1.ListeningState(components);
        this.busyState = new busy_state_1.BusyState(components);
        this.idleState.AllowedStateTransitions = new Map([
            ["listening", this.listeningState],
        ]);
        this.listeningState.AllowedStateTransitions = new Map([
            ["busy", this.busyState],
            ["idle", this.idleState],
        ]);
        this.busyState.AllowedStateTransitions = new Map([
            ["idle", this.idleState],
        ]);
        this.currentState = this.idleState;
        this.currentState.onEnter();
    }
}
exports.AlexaStateMachine = AlexaStateMachine;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(1);
const path = __webpack_require__(0);
const base_state_1 = __webpack_require__(3);
class BusyState extends base_state_1.State {
    constructor(components) {
        super(components, "busy");
    }
    onEnter() {
        this.components.rendererSend("busy", {});
        const readStream = fs.createReadStream(path.resolve(__dirname, "temp/to-amazon.wav"));
        const accessToken = this.components.configService.Config.accessToken;
        this.components.audioService
            .sendAudio(accessToken, readStream)
            .then(result => {
            this.components.rendererSend("speak", {});
        })
            .catch(err => {
            console.error(err);
            this.transition(this.allowedStateTransitions.get("idle"));
        });
        this.rendererSubscription = this.components.rendererCommunicator.Observable.subscribe(type => {
            if (type === "finishedSpeaking") {
                this.transition(this.allowedStateTransitions.get("idle"));
            }
        });
    }
    onExit() {
        this.rendererSubscription.unsubscribe();
    }
}
exports.BusyState = BusyState;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const record = __webpack_require__(6);
const detector_1 = __webpack_require__(19);
const base_state_1 = __webpack_require__(3);
class IdleState extends base_state_1.State {
    constructor(components) {
        super(components, "idle");
    }
    onEnter() {
        this.components.rendererSend("idle", {});
        this.components.detector = new detector_1.HotwordDetector(this.components.models);
        this.components.mic = this.createMic();
        // tslint:disable-next-line:no-any
        this.components.mic.pipe(this.components.detector);
        this.detectorSubscription = this.components.detector.Observable.subscribe(value => {
            switch (value) {
                case 1 /* Hotword */:
                    this.transition(this.allowedStateTransitions.get("listening"));
                    break;
            }
        });
    }
    onExit() {
        this.detectorSubscription.unsubscribe();
    }
    createMic() {
        const mic = record.start({
            threshold: 0,
            verbose: false,
        });
        return mic;
    }
}
exports.IdleState = IdleState;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(0);
const Rx_1 = __webpack_require__(2);
const snowboy_1 = __webpack_require__(5);
class HotwordDetector extends snowboy_1.Detector {
    constructor(models) {
        super({
            resource: path.resolve(__dirname, "resources/common.res"),
            models: models,
            audioGain: 2.0,
        });
        this.subject = new Rx_1.Subject();
        this.setUp();
    }
    setUp() {
        this.on("hotword", () => {
            this.hotwordStartAt = Date.now();
            this.subject.next(1 /* Hotword */);
        });
        this.on("sound", () => {
            if (this.hotwordStartAt) {
                this.hasSaidSomething = true;
            }
        });
        this.on("silence", () => {
            if (this.hasSaidSomething || Date.now() - this.hotwordStartAt > 5000) {
                this.subject.next(0 /* Silence */);
                this.hotwordStartAt = undefined;
                this.hasSaidSomething = false;
            }
        });
        this.on("error", console.error);
    }
    get Observable() {
        return this.subject.asObservable();
    }
}
exports.HotwordDetector = HotwordDetector;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(1);
const record = __webpack_require__(6);
const path = __webpack_require__(0);
const base_state_1 = __webpack_require__(3);
class ListeningState extends base_state_1.State {
    constructor(components) {
        super(components, "listening");
    }
    onEnter() {
        this.components.rendererSend("listening", {});
        const writeStream = fs.createWriteStream(path.resolve(__dirname, "temp/to-amazon.wav"));
        writeStream.on("finish", () => {
            this.transition(this.allowedStateTransitions.get("busy"));
        });
        this.components.mic.pipe(writeStream);
        this.detectorSubscription = this.components.detector.Observable.subscribe(value => {
            switch (value) {
                case 0 /* Silence */:
                    record.stop();
                    break;
            }
        });
    }
    onExit() {
        this.detectorSubscription.unsubscribe();
    }
}
exports.ListeningState = ListeningState;


/***/ })
/******/ ]);