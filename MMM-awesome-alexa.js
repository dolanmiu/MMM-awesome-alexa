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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AlexaNotification;
(function (AlexaNotification) {
    AlexaNotification["Idle"] = "idle";
    AlexaNotification["Listening"] = "listening";
    AlexaNotification["Busy"] = "busy";
    AlexaNotification["Speaking"] = "speak";
})(AlexaNotification || (AlexaNotification = {}));
const alexa_mirror_1 = __webpack_require__(1);
let alexaMirror;
const texts = [];
Module.register("MMM-awesome-alexa", {
    // Default module config.
    defaults: {
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
        lite: false,
    },
    start: function () {
        if (this.config.refreshToken === undefined) {
            texts.push("Refresh token must be set in the config before using awesome-alexa!");
        }
        this.sendSocketNotification("CONFIG", this.config);
    },
    getDom: function () {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");
        alexaWrapper.classList.add("wrapper");
        const spinner = this.createLoadingSpinner();
        const alexaCircle = document.createElement("div");
        alexaCircle.classList.add("alexa-circle");
        alexaWrapper.appendChild(spinner);
        alexaWrapper.appendChild(alexaCircle);
        if (texts.length > 0) {
            alexaWrapper.classList.add("wrapper-error");
            for (const text of texts) {
                alexaWrapper.appendChild(document.createTextNode(text));
            }
        }
        alexaMirror = new alexa_mirror_1.default(alexaWrapper, undefined, this.config, (event, payload) => {
            this.sendSocketNotification(event, payload);
        }, alexaCircle);
        alexaMirror.start();
        return alexaWrapper;
    },
    getStyles: function () {
        return [
            this.file("styles/global.css"),
        ];
    },
    socketNotificationReceived: function (notification, payload) {
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        alexaMirror.receivedNotification(notification, payload);
    },
    createLoadingSpinner: function () {
        var img = document.createElement("img");
        img.setAttribute('src', 'modules/MMM-awesome-alexa/styles/loading.gif');
        img.setAttribute('id', 'loading-spinner');
        img.classList.add('loading-spinner');
        img.classList.add('hidden');
        return img;
    },
    createCanvas: function () {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        return canvas;
    }
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// import { RainbowVisualizer } from "./visualizer/rainbow-visualizer";
// import { Visualizer } from "./visualizer/visualizer";
Object.defineProperty(exports, "__esModule", { value: true });
var AlexaNotification;
(function (AlexaNotification) {
    AlexaNotification["Idle"] = "idle";
    AlexaNotification["Listening"] = "listening";
    AlexaNotification["Busy"] = "busy";
    AlexaNotification["Speaking"] = "speak";
})(AlexaNotification || (AlexaNotification = {}));
class AlexaMirror {
    // private visualizer: Visualizer;
    constructor(mainDiv, canvas, config, mainSend, alexaCircle) {
        this.mainDiv = mainDiv;
        this.config = config;
        this.mainSend = mainSend;
        this.alexaCircle = alexaCircle;
        if (this.config.lite) {
            alexaCircle.remove();
        }
        // this.visualizer = new RainbowVisualizer(canvas, this.avsWrapper.AudioContext);
    }
    start() {
        // this.visualizer.init();
    }
    receivedNotification(type, payload) {
        switch (type) {
            case AlexaNotification.Idle:
                this.idle();
                break;
            case AlexaNotification.Listening:
                this.listening();
                break;
            case AlexaNotification.Busy:
                this.busy();
                break;
            case AlexaNotification.Speaking:
                this.speaking();
                break;
        }
    }
    listening() {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--listening");
            this.mainDiv.classList.add("wrapper-active");
        }
        else {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    }
    idle() {
        if (!this.config.lite) {
            this.mainDiv.classList.remove("wrapper-active");
        }
    }
    busy() {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--busy");
        }
    }
    speaking() {
        const sound = new Audio("/output.mpeg");
        sound.play();
        sound.addEventListener("ended", () => {
            this.mainSend("finishedSpeaking", {});
        });
        if (this.config.lite) {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        }
        else {
            this.alexaCircle.classList.remove("alexa-circle--busy", "alexa-circle--listening");
        }
    }
}
exports.default = AlexaMirror;


/***/ })
/******/ ]);