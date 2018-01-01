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
const circle_visualizer_1 = __webpack_require__(1);
var AlexaNotification;
(function (AlexaNotification) {
    AlexaNotification["Idle"] = "idle";
    AlexaNotification["Listening"] = "listening";
    AlexaNotification["Busy"] = "busy";
    AlexaNotification["Speaking"] = "speak";
})(AlexaNotification || (AlexaNotification = {}));
const texts = [];
Module.register("MMM-awesome-alexa", {
    // Default module config.
    defaults: {
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
        lite: false,
        isSpeechVisualizationEnabled: false,
    },
    start() {
        if (this.config.refreshToken === undefined) {
            texts.push("Refresh token must be set in the config before using awesome-alexa!");
        }
        this.sendSocketNotification("CONFIG", this.config);
        this.canvas = this.createCanvas();
        if (this.config.isSpeechVisualizationEnabled) {
            this.visualizer = new circle_visualizer_1.default(this.canvas);
        }
    },
    getDom() {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");
        alexaWrapper.classList.add("wrapper");
        const spinner = this.createLoadingSpinner();
        const alexaCircle = document.createElement("div");
        alexaCircle.classList.add("alexa-circle");
        alexaWrapper.appendChild(spinner);
        alexaWrapper.appendChild(alexaCircle);
        alexaWrapper.appendChild(this.canvas);
        if (texts.length > 0) {
            alexaWrapper.classList.add("wrapper-error");
            for (const text of texts) {
                alexaWrapper.appendChild(document.createTextNode(text));
            }
        }
        this.alexaCircle = alexaCircle;
        this.mainDiv = alexaWrapper;
        return alexaWrapper;
    },
    getStyles() {
        return [this.file("styles/global.css")];
    },
    createLoadingSpinner() {
        const img = document.createElement("img");
        img.setAttribute("src", "modules/MMM-awesome-alexa/styles/loading.gif");
        img.setAttribute("id", "loading-spinner");
        img.classList.add("loading-spinner");
        img.classList.add("hidden");
        return img;
    },
    createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        return canvas;
    },
    socketNotificationReceived(notification, payload) {
        Log.log(this.name + " received a notification: " + notification + " - Payload: " + payload);
        switch (notification) {
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
    },
    listening() {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--listening");
            this.mainDiv.classList.add("wrapper-active");
        }
        else {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    },
    idle() {
        if (!this.config.lite) {
            this.mainDiv.classList.remove("wrapper-active");
        }
    },
    busy() {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--busy");
        }
    },
    speaking() {
        const sound = new Audio("/output.mpeg");
        if (this.config.isSpeechVisualizationEnabled) {
            this.visualizer.connect(sound);
            this.visualizer.start();
        }
        sound.play();
        sound.addEventListener("ended", () => {
            this.sendSocketNotification("finishedSpeaking", {});
            if (this.config.isSpeechVisualizationEnabled) {
                this.visualizer.stop();
            }
        });
        if (this.config.lite) {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        }
        else {
            this.alexaCircle.classList.remove("alexa-circle--busy", "alexa-circle--listening");
        }
    },
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const visualizer_1 = __webpack_require__(2);
class CircleVisualizer extends visualizer_1.Visualizer {
    constructor(canvas) {
        super(canvas, 32);
    }
    start() {
        super.start();
        this.drawFunction = (freqs, times, drawContext, canvas) => {
            const frequency = freqs[0];
            const scaledFrequency = frequency / 10;
            drawContext.beginPath();
            drawContext.arc(canvas.width / 2, canvas.height / 2, scaledFrequency, 0, 2 * Math.PI);
            drawContext.fillStyle = "white";
            drawContext.fill();
        };
    }
    stop() {
        // Allow for animation to finish
        setTimeout(() => {
            super.stop();
        }, 1000);
    }
}
exports.default = CircleVisualizer;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Interesting parameters to tweak!
const SMOOTHING = 0.6;
class Visualizer {
    constructor(canvas, fftSize = 2048) {
        this.canvas = canvas;
        this.drawContext = canvas.getContext("2d");
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.drawFunc = () => {
            return;
        };
        this.analyser.minDecibels = -140;
        this.analyser.maxDecibels = 0;
        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
        this.times = new Uint8Array(this.analyser.frequencyBinCount);
    }
    connect(sound) {
        const source = this.audioContext.createMediaElementSource(sound);
        source.connect(this.audioContext.destination);
        source.connect(this.analyser);
    }
    draw() {
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.freqs);
        this.analyser.getByteTimeDomainData(this.times);
        this.drawFunc(this.freqs, this.times, this.drawContext, this.canvas);
        this.loop = requestAnimationFrame(this.draw.bind(this));
    }
    set drawFunction(func) {
        this.drawFunc = func;
    }
    start() {
        this.draw();
    }
    stop() {
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        cancelAnimationFrame(this.loop);
    }
}
exports.Visualizer = Visualizer;


/***/ })
/******/ ]);