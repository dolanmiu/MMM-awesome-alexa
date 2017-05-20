import * as request from "request";
import { IAVSOptions } from "./avs-options";

const url = "https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize";

export class AudioService {

    constructor(private options: IAVSOptions) {
    }

    public sendAudio(dataView: DataView): Promise {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            request.post({
                uri: url,
                headers: {
                    "Authorization": `Bearer ${this.options.token}`,
                    "Content-Type": "multipart/form-data; boundary=" + "BOUNDARY1234",
                },
            }, (err, response, body) => {
            });

            xhr.open('POST', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = (event) => {
                const buffer = new Buffer(xhr.response);

                if (xhr.status === 200) {
                    const parsedMessage = httpMessageParser(buffer);
                    resolve({ xhr, response: parsedMessage });
                } else {
                    let error = new Error('An error occured with request.');
                    let response = {};

                    if (!xhr.response.byteLength) {
                        error = new Error('Empty response.');
                    } else {
                        try {
                            response = JSON.parse(arrayBufferToString(buffer));
                        } catch (err) {
                            error = err;
                        }
                    }

                    if (response.error instanceof Object) {
                        if (response.error.code === AMAZON_ERROR_CODES.InvalidAccessTokenException) {
                            this.emit(AVS.EventTypes.TOKEN_INVALID);
                        }

                        error = response.error.message;
                    }

                    this.emit(AVS.EventTypes.ERROR, error);
                    return reject(error);
                }
            };

            xhr.onerror = (error) => {
                this._log(error);
                reject(error);
            };

            const BOUNDARY = 'BOUNDARY1234';
            const BOUNDARY_DASHES = '--';
            const NEWLINE = '\r\n';
            const METADATA_CONTENT_DISPOSITION = 'Content-Disposition: form-data; name="metadata"';
            const METADATA_CONTENT_TYPE = 'Content-Type: application/json; charset=UTF-8';
            const AUDIO_CONTENT_TYPE = 'Content-Type: audio/L16; rate=16000; channels=1';
            const AUDIO_CONTENT_DISPOSITION = 'Content-Disposition: form-data; name="audio"';

            const metadata = {
                messageHeader: {},
                messageBody: {
                    profile: 'alexa-close-talk',
                    locale: 'en-us',
                    format: 'audio/L16; rate=16000; channels=1'
                }
            };

            const postDataStart = [
                NEWLINE, BOUNDARY_DASHES, BOUNDARY, NEWLINE, METADATA_CONTENT_DISPOSITION, NEWLINE, METADATA_CONTENT_TYPE,
                NEWLINE, NEWLINE, JSON.stringify(metadata), NEWLINE, BOUNDARY_DASHES, BOUNDARY, NEWLINE,
                AUDIO_CONTENT_DISPOSITION, NEWLINE, AUDIO_CONTENT_TYPE, NEWLINE, NEWLINE
            ].join('');

            const postDataEnd = [NEWLINE, BOUNDARY_DASHES, BOUNDARY, BOUNDARY_DASHES, NEWLINE].join('');

            const size = postDataStart.length + dataView.byteLength + postDataEnd.length;
            const uint8Array = new Uint8Array(size);
            let i = 0;

            for (; i < postDataStart.length; i++) {
                uint8Array[i] = postDataStart.charCodeAt(i) & 0xFF;
            }

            for (let j = 0; j < dataView.byteLength; i++ , j++) {
                uint8Array[i] = dataView.getUint8(j);
            }

            for (let j = 0; j < postDataEnd.length; i++ , j++) {
                uint8Array[i] = postDataEnd.charCodeAt(j) & 0xFF;
            }

            const payload = uint8Array.buffer;

            xhr.setRequestHeader('Authorization', `Bearer ${this.options.token}`);
            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + BOUNDARY);
            xhr.send(payload);
        });
    }

}
