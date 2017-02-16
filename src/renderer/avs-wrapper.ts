// import * as AVS from "alexa-voice-service";
const AVS = require("alexa-voice-service");

const token = "Atza|IwEBIHJmkV7z2SEpL5gZjXc_aEn9sp0WpjLEcgeaX0B3X3-ZAlXNWvk9YmSFA60fvquAk76mLAXG9JsKPO61rWGV-V-19CmHZFHpMJ_iFIDXTv36MCznfgU1kBb3oPF50rr60tXMGHyjIOU-zUbt3KQt5xBz-dcMhbBcaRYRHngGyhEWGkunD6b9SgqQOS7ODXAmkjirSTcEOX32dvsndU_Xya0K4QC8vceNrqNJ9_OXF8BpjZE8EGW_4mN1rZYgMDAAL14EvhgfZAD9jSzWnZmfig2hiDGqgcmuXyU21YE5ELNvqNFZQR0xlzYVQSaHBOPU_5pZtT09a-KEgal99nTICyCXc2HD1HeJaF9euR3DUrOvNRV4Vxyuhpzm2n-LdClS9lcp73nKL-df_aspgy29Dt5Fnw2MxGVQB6WdZ2E2JOkF8bg6SLhvJ4TZFBocyDPeAHU6Ey-1Dst5hdBRJD9j6ACH6fGZm5gON2UNAVfyghQUO6RE2Y4uFONMo5RiYoGAWdWhz_JJaLsyGYKujkHSNT-oGDN9Lr9Ig4ySFoQJKwUNaQ";

const refreshToken = "Atzr|IwEBILVXEPwQ1WBP0g28icIpbX8UnfwfeZ0U4ffd_uQz0txBZqS2NZ-F0Jl8iUKHasQDzdwhrgvIOz5uaTKED8ZYPMNpYjJz0tUz07j_Ba2M0Y0t3m-VU6n_dRdJ0N7y6xEDwXbIFDq-dQ_Ufe_OOlUGNEyXP3XyQD_kKyb4UX5sWAjrr_0i-CcOtUUsEieMEabgncpAm4ocRfa7NUR3SGBz9nPYnSbRMT8yDRaZRYJbz9voDWAl0LkIr1OMwHrM59YbKLu9IMtQya3JAJXpamsnjAaWS9NPQ7OLFcf5jAKZNd_T2-wIB-radH6tgE4SWuW-qUHemf_dB64YC6xdjeOqdT83G46BftK8omPOt57W3mwfNuclHICvWEacGJ3z4zJT5foaH-QZEMPZSAPwE9fIQ2AuBGqSB4qC7Acr9gWx0Fj-43mMzWxnFBe4m3yKaZOqjoCGJiMoCwJROq0VhiP4hn7NvCbAn93R4hb4_6go0e5ExLeAzeBbp5exRjf6GVX0-pifxq6XF3NrRaAeG0k67m-vy3gPjtEN0MutCdKQ8HAIFA";

export class AVSWrapper {
    private avs: any;

    constructor() {
        this.avs = new AVS({
            debug: true,
            clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
            clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
            deviceId: "magic_mirror_alexa",
            deviceSerialNumber: 123,
            redirectUri: `https://${window.location.host}/authresponse`,
            token: token,
            refreshToken: refreshToken,
        });

    }

    public init(): void {
        this.avs.refreshToken().then(() => this.avs.requestMic())
            .catch((error: Error) => { console.log(error); });
    }

    public startRecording(): void {
        this.avs.startRecording();
    }

    public stopRecording(): Promise<any> {
        return new Promise((resolve, reject) => {

            this.avs.stopRecording().then((dataView: any) => {

                this.avs.sendAudio(dataView).then(({xhr, response}: any) => {
                    const map = this.createDirectives(xhr, response);
                    this.runDirectives(map.directives, map.audioMap);
                }).catch((error: Error) => {
                    console.error(error); /* send audio error */
                    reject(error);
                });
            });
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
            if (multipart.headers && multipart.headers["Content-Type"] === "application/json") {
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

    private findAudioFromContentId(contentId: string, audioMap: any) {
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
