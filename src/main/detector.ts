import { Observable, Subject } from "rxjs/Rx";
import { Detector, Models } from "snowboy";

export class HotwordDetector extends Detector {
    private subject: Subject<DETECTOR>;
    private hotwordStartAt: number;
    private hasSaidSomething: boolean;

    constructor(models: Models) {
        super({
            resource: `${process.env.CWD}/resources/common.res`,
            models: models,
            audioGain: 2.0,
        });
        this.subject = new Subject<DETECTOR>();
        this.setUp();
    }

    private setUp(): void {
        this.on("silence", () => {
            if (this.hasSaidSomething || Date.now() - this.hotwordStartAt > 10000) {
                this.subject.next(DETECTOR.Silence);
                this.hotwordStartAt = undefined;
                this.hasSaidSomething = false;
            }
        });

        this.on("sound", () => {
            if (this.hotwordStartAt) {
                this.hasSaidSomething = true;
            }
        });

        this.on("error", console.error);

        this.on("hotword", (index, hotword) => {
            this.hotwordStartAt = Date.now();
            console.log("hotword", index, hotword);
            this.subject.next(DETECTOR.Hotword);
        });
    }

    public get Observable(): Observable<DETECTOR> {
        return this.subject.asObservable();
    }
}
