import * as fs from "fs";

export class Recorder {
    private writeStream: fs.WriteStream;
    private isStarted: boolean;

    constructor() {
        this.isStarted = false;
    }

    public start(): void {
        this.isStarted = true;
        this.writeStream = fs.createWriteStream(`${process.env.CWD}/temp/to-amazon.wav`);
    }

    public stop(): Promise<void> {
        this.isStarted = false;

        return new Promise<void>((resolve) => {
            this.writeStream.on("finish", () => {
                resolve();
            });
        });
    }

    public get IsStarted(): boolean {
        return this.isStarted;
    }

    public get WriteStream(): fs.WriteStream {
        return this.writeStream;
    }
}
