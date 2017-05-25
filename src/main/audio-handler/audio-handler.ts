// import * as record from "node-record-lpcm16";
// import { Subscription } from "rxjs/Subscription";
// import { Models } from "snowboy";
// import { AlexaDetector } from "./detector";

// export class AudioHandler {
//     private detector: AlexaDetector;
//     private mic: record.Mic;
//     private detectorSubscription: Subscription;

//     constructor(private models: Models) {
//     }

//     public listenForHotword(): void {
//         this.createMic();
//         this.detector = new AlexaDetector(this.models);
//         // tslint:disable-next-line:no-any
//         this.mic.pipe(this.detector as any);

//     }

//     public recordToFile(): void {
//         if (this.mic === undefined) {
//             throw new Error("Please start mic before recording to file");
//         }

//         this.detectorSubscription = this.detector.Observable.subscribe((value) => {
//             switch (value) {
//                 case DETECTOR.Silence:
//                     record.stop();
//                     this.mic = undefined;
//                     break;
//             }
//         });

//     }

//     private createMic(): void {
//         this.mic = record.start({
//             threshold: 0,
//             verbose: false,
//         });
//     }
// }
