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
        record.stop();
        this.mic = undefined;
    }

    public get Mic(): record.Mic {
        return this.mic;
    }
}
