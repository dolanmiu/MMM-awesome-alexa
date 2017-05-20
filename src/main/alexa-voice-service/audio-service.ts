import * as request from "request";

const url = "https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize";

export class AudioService {

    public sendAudio(token: string, file: Buffer): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            console.log(file.toString("utf8"));
            request.post({
                uri: url,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data;",
                },
                formData: {
                    metadata: {
                        options: {
                            messageHeader: {},
                            messageBody: {
                                profile: "alexa-close-talk",
                                locale: "en-us",
                                format: "audio/L16; rate=16000; channels=1",
                            },
                        },
                    },
                    audio: {
                        value: file.toString("utf8"),
                    },
                },
            }, (err, response, body) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(body);
                    return;
                }

                resolve(body);
            });

            // const BOUNDARY = 'BOUNDARY1234';
            // const BOUNDARY_DASHES = '--';
            // const NEWLINE = '\r\n';
            // const METADATA_CONTENT_DISPOSITION = 'Content-Disposition: form-data; name="metadata"';
            // const METADATA_CONTENT_TYPE = 'Content-Type: application/json; charset=UTF-8';
            // const AUDIO_CONTENT_TYPE = 'Content-Type: audio/L16; rate=16000; channels=1';
            // const AUDIO_CONTENT_DISPOSITION = 'Content-Disposition: form-data; name="audio"';

            // const metadata = {
            //     messageHeader: {},
            //     messageBody: {
            //         profile: 'alexa-close-talk',
            //         locale: 'en-us',
            //         format: 'audio/L16; rate=16000; channels=1'
            //     }
            // };

            // const postDataStart = [
            //     NEWLINE, BOUNDARY_DASHES, BOUNDARY, NEWLINE, METADATA_CONTENT_DISPOSITION, NEWLINE, METADATA_CONTENT_TYPE,
            //     NEWLINE, NEWLINE, JSON.stringify(metadata), NEWLINE, BOUNDARY_DASHES, BOUNDARY, NEWLINE,
            //     AUDIO_CONTENT_DISPOSITION, NEWLINE, AUDIO_CONTENT_TYPE, NEWLINE, NEWLINE
            // ].join('');

            // const postDataEnd = [NEWLINE, BOUNDARY_DASHES, BOUNDARY, BOUNDARY_DASHES, NEWLINE].join('');

            // const size = postDataStart.length + dataView.byteLength + postDataEnd.length;
            // const uint8Array = new Uint8Array(size);
            // let i = 0;

            // for (; i < postDataStart.length; i++) {
            //     uint8Array[i] = postDataStart.charCodeAt(i) & 0xFF;
            // }

            // for (let j = 0; j < dataView.byteLength; i++ , j++) {
            //     uint8Array[i] = dataView.getUint8(j);
            // }

            // for (let j = 0; j < postDataEnd.length; i++ , j++) {
            //     uint8Array[i] = postDataEnd.charCodeAt(j) & 0xFF;
            // }

            // const payload = uint8Array.buffer;
        });
    }

}
