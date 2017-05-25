import * as record from "node-record-lpcm16";

export class MicHandler {
    private mic: record.Mic;

    public start(): void {
        if (this.mic !== undefined) {
            throw new Error("Cannot start mic which is already started");
        }

        this.mic = record.start({
            threshold: 0,
            verbose: false,
        });
    }

    public stop(): void {
        if (this.mic === undefined) {
            throw new Error("Cannot stop mic which is already stopped");
        }

        record.stop();
        this.mic = undefined;
    }

    public pipe(readable: NodeJS.WritableStream): void {
        if (this.mic === undefined) {
            throw new Error("Please start before piping");
        }
        this.mic.pipe(readable);
    }

    public get Mic(): record.Mic {
        return this.mic;
    }
}
