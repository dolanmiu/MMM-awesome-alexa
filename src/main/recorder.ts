import * as fs from "fs";
import * as record from "node-record-lpcm16";

export class Recorder {
    private mic: record.Mic;

    constructor(private cwd: string) {
    }

    public start(): void {
        if (this.mic !== undefined) {
            return;
        }

        const date = new Date();
        const out = fs.createWriteStream(`${this.cwd}/temp/${date.getTime()}.wav`);
        this.mic = record.start({
            threshold: 0,
            verbose: true,
        });
        this.mic.pipe(out);
    }

    public stop(): void {
        if (this.mic === undefined) {
            return;
        }

        record.stop();
        this.mic = undefined;
    }
}
