import { Observable } from "rxjs/Observable";
const vad = require("voice-activity-detection");

declare var window: any;
declare var navigator: any;

export class VADWrapper {
    private audioContext: AudioContext;
    private status: Observable<VadStatus>;

    constructor() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    public init(): void {
        this.status = new Observable<VadStatus>((observer) => {
            try {
                navigator.getUserMedia({ audio: true }, (stream: any) => {
                    const options = {
                        onVoiceStart: () => {
                            observer.next(VadStatus.Started);
                            console.log("Voice Started");
                        },
                        onVoiceStop: () => {
                            observer.next(VadStatus.Stopped);
                            console.log("Voice Stop");
                            
                        },
                        onUpdate: (val: number) => {
                            // No need
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
        });
    }

    public get Status(): Observable<VadStatus> {
        return this.status;
    }
}
