// import * as AVS from "alexa-voice-service";
import { Utility } from "./utility";
const AVS = require("alexa-voice-service");

export class AVSWrapper {
    public onStartRecordingCallback: () => void;
    public onStopRecordingCallback: () => void;
    public onPlayCallback: () => void;

    private avs: any;

    constructor(config: Config) {
        this.avs = new AVS({
            debug: true,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            deviceId: config.deviceId,
            refreshToken: config.refreshToken,
        });

        this.avs.on(AVS.EventTypes.RECORD_START, () => {
            const func = this.onStartRecordingCallback || Utility.Noop;
            func();
        });

        this.avs.on(AVS.EventTypes.RECORD_STOP, () => {
            const func = this.onStopRecordingCallback || Utility.Noop;
            func();
        });

        this.avs.player.on(AVS.Player.EventTypes.PLAY, () => {
            const func = this.onPlayCallback || Utility.Noop;
            func();
        });
    }

    public init(): void {
        this.avs.refreshToken().then(() => this.avs.requestMic())
            .catch((error: Error) => { console.error(error); });
    }

    public startRecording(): void {
        this.avs.startRecording();
    }

    public stopRecording(): Promise<any> {
        return new Promise((resolve) => {
            this.avs.stopRecording().then((dataView: any) => {
                if (dataView === undefined) {
                    resolve();
                    return;
                }
                this.avs.sendAudio(dataView).then(({ xhr, response }: any) => {
                    const map = this.createDirectives(xhr, response);
                    this.runDirectives(map.directives, map.audioMap);
                }).catch((error: Error) => {
                    console.error(error);
                    resolve();
                    // this.initAvs();
                });
            });
        });
    }

    public get AudioContext(): AudioContext {
        return this.avs.player._context;
    }

    public get Source(): AudioBufferSourceNode {
        return this.avs.player._currentSource;
    }

    private createDirectives(xhr: any, response: any): { directives: any, audioMap: any } {
        let directives = null;
        const audioMap: { [key: string]: any } = {};

        // message parsing, assigning directives and audio
        if (!response.multipart.length) {
            return;
        }

        response.multipart.forEach((multipart: any) => {
            let body = multipart.body;
            if (!multipart.headers) {
                throw new Error(`creating directives failed: ${multipart}`);
            }

            if (multipart.headers["Content-Type"] === "application/json") {
                try {
                    body = JSON.parse(body);
                } catch (error) {
                    console.error(error);
                }

                if (body && body.messageBody && body.messageBody.directives) {
                    directives = body.messageBody.directives;
                }
            } else if (multipart.headers["Content-Type"] === "audio/mpeg") {
                const start = multipart.meta.body.byteOffset.start;
                const end = multipart.meta.body.byteOffset.end;

                /**
                 * Not sure if bug in buffer module or in http message parser
                 * because it"s joining arraybuffers so I have to this to
                 * seperate them out.
                 */
                const slicedBody = xhr.response.slice(start, end);

                audioMap[multipart.headers["Content-ID"]] = slicedBody;
            }
        });

        return {
            directives: directives,
            audioMap: audioMap,
        };
    }

    private findAudioFromContentId(contentId: string, audioMap: any): void {
        contentId = contentId.replace("cid:", "");
        for (const key in audioMap) {
            if (key.indexOf(contentId) > -1) {
                return audioMap[key];
            }
        }
    }

    private runDirectives(directives: any, audioMap: any): void {
        const promises: Promise<any>[] = [];

        directives.forEach((directive: any) => {
            if (directive.namespace === "SpeechSynthesizer") {
                if (directive.name === "speak") {
                    const contentId = directive.payload.audioContent;
                    const audio = this.findAudioFromContentId(contentId, audioMap);
                    if (audio) {
                        promises.push(this.avs.player.enqueue(audio));
                    }
                }
            } else if (directive.namespace === "AudioPlayer") {
                if (directive.name === "play") {
                    const streams = directive.payload.audioItem.streams;
                    streams.forEach((stream: any) => {
                        const streamUrl = stream.streamUrl;

                        const audio = this.findAudioFromContentId(streamUrl, audioMap);
                        if (audio) {
                            promises.push(this.avs.player.enqueue(audio));
                        } else if (streamUrl.indexOf("http") > -1) {
                            const xhr = new XMLHttpRequest();
                            const url = `/parse-m3u?url=${streamUrl.replace(/!.*$/, "")}`;
                            xhr.open("GET", url, true);
                            xhr.responseType = "json";
                            xhr.onload = (event) => {
                                const urls = (event.currentTarget as any).response;

                                for (const currentUrl of urls) {
                                    this.avs.player.enqueue(currentUrl);
                                }
                            };
                            xhr.send();
                        }
                    });
                } else if (directive.namespace === "SpeechRecognizer") {
                    if (directive.name === "listen") {
                        // const timeout = directive.payload.timeoutIntervalInMillis;
                        // enable mic
                    }
                }
            }

            Promise.all(promises).then(() => {
                this.avs.player.playQueue();
            });
        });
    }
}
