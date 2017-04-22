import { Utility } from "./utility";
const vad = require("voice-activity-detection");

declare var window: any;
declare var navigator: any;
const STOP_SPEECH_DELAY_TIME = 500;

export class VADWrapper {
    public onStopCallback: () => void;
    public onStartCallback: () => void;
    private audioContext: AudioContext;
    private speechTimeout: NodeJS.Timer;

    constructor() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    public init(): void {
        try {
            navigator.getUserMedia({ audio: true }, (stream: any) => {
                const options = {
                    onVoiceStart: () => {
                        const func = this.onStartCallback || Utility.Noop;
                        func();
                        clearTimeout(this.speechTimeout);
                    },
                    onVoiceStop: () => {
                        this.speechTimeout = setTimeout(() => {
                            const func = this.onStopCallback || Utility.Noop;
                            func();
                        }, STOP_SPEECH_DELAY_TIME);
                    },
                    onUpdate: (val: number) => {
                        // console.log("curr val:", val);
                    },
                };
                vad(this.audioContext, stream, options);
            }, (e: Error) => {
                console.error("Could not connect microphone. Possibly rejected by the user or is blocked by the browser.");
                console.error(e);
            });
        } catch (e) {
            console.error("Mic input is not supported by the browser.");
            console.error(e);
        }
    }
}
