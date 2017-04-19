// import * as AVS from "alexa-voice-service";
const AVS = require("alexa-voice-service");

const refreshToken = "Atzr|IwEBILVXEPwQ1WBP0g28icIpbX8UnfwfeZ0U4ffd_uQz0txBZqS2NZ-F0Jl8iUKHasQDzdwhrgvIOz5uaTKED8ZYPMNpYjJz0tUz07j_Ba2M0Y0t3m-VU6n_dRdJ0N7y6xEDwXbIFDq-dQ_Ufe_OOlUGNEyXP3XyQD_kKyb4UX5sWAjrr_0i-CcOtUUsEieMEabgncpAm4ocRfa7NUR3SGBz9nPYnSbRMT8yDRaZRYJbz9voDWAl0LkIr1OMwHrM59YbKLu9IMtQya3JAJXpamsnjAaWS9NPQ7OLFcf5jAKZNd_T2-wIB-radH6tgE4SWuW-qUHemf_dB64YC6xdjeOqdT83G46BftK8omPOt57W3mwfNuclHICvWEacGJ3z4zJT5foaH-QZEMPZSAPwE9fIQ2AuBGqSB4qC7Acr9gWx0Fj-43mMzWxnFBe4m3yKaZOqjoCGJiMoCwJROq0VhiP4hn7NvCbAn93R4hb4_6go0e5ExLeAzeBbp5exRjf6GVX0-pifxq6XF3NrRaAeG0k67m-vy3gPjtEN0MutCdKQ8HAIFA";

export class AVSWrapper {
    public startRecordingCallbacks: (() => void)[];
    public stopRecordingCallbacks: (() => void)[];
    public playCallbacks: (() => void)[];

    private avs: any;
    private isRecording: boolean;

    constructor() {
        this.initAvs();
    }

    public init(): void {
        this.avs.refreshToken().then(() => this.avs.requestMic())
            .catch((error: Error) => { console.error(error); });
    }

    public startRecording(): void {
        this.avs.startRecording();
    }

    public stopRecording(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.avs.stopRecording().then((dataView: any) => {
                this.avs.sendAudio(dataView).then(({ xhr, response }: any) => {
                    const map = this.createDirectives(xhr, response);
                    this.runDirectives(map.directives, map.audioMap);
                }).catch((error: Error) => {
                    console.error(error);
                    reject(error);
                    this.initAvs();
                });
            });
        });
    }

    public get IsRecording(): boolean {
        return this.isRecording;
    }

    public get AudioContext(): AudioContext {
        return this.avs.player._context;
    }

    public get Source(): AudioBufferSourceNode {
        return this.avs.player._currentSource;
    }

    public onStartRecording(callback: () => void): void {
        this.startRecordingCallbacks.push(callback);
    }

    public onStopRecording(callback: () => void): void {
        this.stopRecordingCallbacks.push(callback);
    }

    public onPlaying(callback: () => void): void {
        this.playCallbacks.push(callback);
    }

    private initAvs(): void {
        this.avs = new AVS({
            debug: true,
            clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
            clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
            deviceId: "magic_mirror_alexa",
            refreshToken: refreshToken,
        });

        this.avs.on(AVS.EventTypes.RECORD_START, () => {
            this.isRecording = true;
            for (const callback of this.startRecordingCallbacks) {
                callback();
            }
        });

        this.avs.on(AVS.EventTypes.RECORD_STOP, () => {
            this.isRecording = false;
            for (const callback of this.stopRecordingCallbacks) {
                callback();
            }
        });

        this.avs.player.on(AVS.Player.EventTypes.PLAY, () => {
            for (const callback of this.playCallbacks) {
                callback();
            }
        });
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
                        const timeout = directive.payload.timeoutIntervalInMillis;
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
