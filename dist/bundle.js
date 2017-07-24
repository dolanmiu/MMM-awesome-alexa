var AlexaVoiceService =
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
/******/ 	__webpack_require__.p = "./";
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
const alexa_mirror_1 = __webpack_require__(1);
exports.AlexaMirror = alexa_mirror_1.AlexaMirror;
const rainbow_visualizer_1 = __webpack_require__(2);
exports.RainbowVisualizer = rainbow_visualizer_1.RainbowVisualizer;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// import { RainbowVisualizer } from "./visualizer/rainbow-visualizer";
// import { Visualizer } from "./visualizer/visualizer";
Object.defineProperty(exports, "__esModule", { value: true });
class AlexaMirror {
    // private visualizer: Visualizer;
    constructor(mainDiv, canvas, lite, mainSend) {
        // this.visualizer = new RainbowVisualizer(canvas, this.avsWrapper.AudioContext);
        this.mainDiv = mainDiv;
        this.lite = lite;
        this.mainSend = mainSend;
        if (!this.lite) {
            this.mainDiv.classList.add("wrapper-smooth");
            document.body.classList.add("body-smooth");
        }
    }
    start() {
        // this.visualizer.init();
    }
    receivedNotification(type, payload) {
        switch (type) {
            case "idle":
                this.idle();
                break;
            case "listening":
                this.listening();
                break;
            case "busy":
                break;
            case "speak":
                this.speaking();
                break;
        }
    }
    listening() {
        if (!this.lite) {
            this.mainDiv.classList.add("wrapper-active");
            document.body.classList.add("down-size");
        }
        else {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    }
    idle() {
        if (!this.lite) {
            this.mainDiv.classList.remove("wrapper-active");
            document.body.classList.remove("down-size");
        }
    }
    speaking() {
        const sound = new Audio("/output.mpeg");
        sound.play();
        sound.addEventListener("ended", () => {
            this.mainSend("finishedSpeaking", {});
        });
        if (this.lite) {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        }
    }
}
exports.AlexaMirror = AlexaMirror;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const visualizer_1 = __webpack_require__(3);
const WIDTH = 640;
const HEIGHT = 360;
class RainbowVisualizer extends visualizer_1.Visualizer {
    init() {
        super.init();
        this.drawFunction = (freqs, times, drawContext) => {
            // Draw the frequency domain chart.
            for (let i = 0; i < freqs.length; i++) {
                const value = freqs[i];
                const percent = value / 256;
                const height = HEIGHT * percent;
                const offset = HEIGHT - height - 1;
                const barWidth = WIDTH / freqs.length;
                const hue = i / freqs.length * 360;
                drawContext.fillStyle = "hsl(" + hue + ", 100%, 50%)";
                drawContext.fillRect(i * barWidth, offset, barWidth, height);
            }
            // Draw the time domain chart.
            for (let i = 0; i < times.length; i++) {
                const value = times[i];
                const percent = value / 256;
                const height = HEIGHT * percent;
                const offset = HEIGHT - height - 1;
                const barWidth = WIDTH / times.length;
                drawContext.fillStyle = "white";
                drawContext.fillRect(i * barWidth, offset, 1, 2);
            }
        };
    }
}
exports.RainbowVisualizer = RainbowVisualizer;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Interesting parameters to tweak!
const SMOOTHING = 0.8;
const FFT_SIZE = 2048;
class Visualizer {
    constructor(canvas, audioContext) {
        this.canvas = canvas;
        this.drawContext = canvas.getContext("2d");
        this.analyser = audioContext.createAnalyser();
        this.drawFunc = () => { return; };
        this.analyser.minDecibels = -140;
        this.analyser.maxDecibels = 0;
        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.analyser.fftSize = FFT_SIZE;
        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
        this.times = new Uint8Array(this.analyser.frequencyBinCount);
    }
    play(source) {
        source.connect(this.analyser);
    }
    draw() {
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.freqs);
        this.analyser.getByteTimeDomainData(this.times);
        this.drawFunc(this.freqs, this.times, this.drawContext);
        requestAnimationFrame(this.draw.bind(this));
    }
    set drawFunction(func) {
        this.drawFunc = func;
    }
    init() {
        this.draw();
    }
}
exports.Visualizer = Visualizer;


/***/ })
/******/ ]);