declare module "node-record-lpcm16" {
    export function start(params: {
        threshold: number,
        verbose: boolean,
    }): Mic;

    export function stop(): any;

    export class Mic {
        pipe(detector: any): void;
    }
}