import * as fs from "fs";
import * as record from "node-record-lpcm16";

export class Recorder {
    private mic: record.Mic;
    private writeStream: fs.WriteStream;

    constructor(private cwd: string) {
    }

    public start(): void {
        if (this.mic !== undefined) {
            return;
        }

        this.writeStream = fs.createWriteStream(`${this.cwd}/temp/to-amazon.wav`);
        this.mic = record.start({
            threshold: 0,
            verbose: false,
        });
        this.mic.pipe(this.writeStream);
    }

    public stop(): Promise<void> {
        if (this.mic === undefined) {
            return;
        }

        record.stop();
        this.mic = undefined;

        return new Promise<void>((resolve) => {
            this.writeStream.on("finish", () => {
                resolve();
            });
        });
    }
}
