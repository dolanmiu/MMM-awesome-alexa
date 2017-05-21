import * as record from "node-record-lpcm16";
import { Observable } from "rxjs/Observable";
import { Detector, Models } from "snowboy";
/* tslint:disable */
const Timer = require('timer-machine');
/* tslint:enable */

export class AlexaDetector extends Detector {
    private silenceTimer = new Timer();
    private observable: Observable<DETECTOR>;

    constructor(models: Models, cwd: string) {
        super({
            resource: cwd + "/resources/common.res",
            models: models,
            audioGain: 2.0,
        });
        this.observable = this.setUp();
    }

    public start(): void {
        const mic = record.start({
            threshold: 0,
            verbose: true,
        });

        mic.pipe(this);
    }

    private setUp(): Observable<DETECTOR> {
        return new Observable<DETECTOR>((observer) => {
            this.on("silence", () => {
                if (this.silenceTimer.isStarted() === false) {
                    this.silenceTimer.start();
                }

                if (this.silenceTimer.timeFromStart() > 1600) {
                    observer.next(DETECTOR.Silence);
                }
            });

            this.on("sound", () => {
                this.silenceTimer.stop();
            });

            this.on("error", (error) => {
                console.error(error);
            });

            this.on("hotword", (index, hotword) => {
                console.log("hotword", index, hotword);
                observer.next(DETECTOR.Hotword);
            });
        });
    }

    public get Observable(): Observable<DETECTOR> {
        return this.observable;
    }
}
