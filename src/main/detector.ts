import * as path from "path";
import { Observable, Subject } from "rxjs/Rx";
import { Detector, Models } from "snowboy";

export class HotwordDetector extends Detector {
    private subject: Subject<DETECTOR>;
    private hotwordStartAt: number;
    private hasSaidSomething: boolean;

    constructor(models: Models) {
        super({
            resource: path.resolve(__dirname, "resources/common.res"),
            models: models,
            audioGain: 2.0,
        });
        this.subject = new Subject<DETECTOR>();
        this.setUp();
    }

    private setUp(): void {
        this.on("hotword", () => {
            this.hotwordStartAt = Date.now();
            this.subject.next(DETECTOR.Hotword);
        });

        this.on("sound", () => {
            if (this.hotwordStartAt) {
                this.hasSaidSomething = true;
            }
        });

        this.on("silence", () => {
            if (this.hasSaidSomething || Date.now() - this.hotwordStartAt > 5000) {
                this.subject.next(DETECTOR.Silence);
                this.hotwordStartAt = undefined;
                this.hasSaidSomething = false;
            }
        });

        this.on("error", console.error);
    }

    public get Observable(): Observable<DETECTOR> {
        return this.subject.asObservable();
    }
}
