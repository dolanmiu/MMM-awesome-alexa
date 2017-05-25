import * as fs from "fs";

import { MicHandler } from "./mic-handler";

export class Recorder {
    private writeStream: fs.WriteStream;
    private isStarted: boolean;

    constructor(private micHandler: MicHandler) {
        this.isStarted = false;
    }

    public start(): void {
        console.log("piped!");
        this.isStarted = true;
        this.writeStream = fs.createWriteStream(`${process.env.CWD}/temp/to-amazon.wav`);
        this.micHandler.pipe(this.writeStream);
    }

    public stop(): Promise<void> {
        this.isStarted = false;

        this.micHandler.Mic.unpipe(this.writeStream);
        // this.micHandler.Mic.unpipe();
        // this.micHandler.stop();
        // this.writeStream();

        // this.writeStream.close();
        return new Promise<void>((resolve) => {
            this.writeStream.on("finish", () => {
                resolve();
            });

            this.writeStream.on("error", (err: any) => {
                console.log(err);
            });
            // setTimeout(() => {
            //     console.log("done");
            //     resolve();
            // }, 2000);
        });
    }

    public get IsStarted(): boolean {
        return this.isStarted;
    }
}
