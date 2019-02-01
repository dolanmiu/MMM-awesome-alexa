// Reference: https://developer.amazon.com/public/solutions/alexa/alexa-voice-service/rest/speechrecognizer-recognize-request
import * as fs from "fs";
import * as path from "path";
import * as request from "request";
import * as httpMessageParser from "http-message-parser";

const url = "https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize";

export class AudioService {
    public sendAudio(token: string, file: fs.ReadStream): Promise<any> {
        const stream = fs.createWriteStream(path.resolve(__dirname, "temp/output.mpeg"));

        return new Promise<any>((resolve, reject) => {
            request
                .post(
                    {
                        uri: url,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        formData: {
                            metadata: {
                                value: JSON.stringify({
                                    messageHeader: {},
                                    messageBody: {
                                        profile: "alexa-close-talk",
                                        locale: "en-us",
                                        format: "audio/L16; rate=16000; channels=1",
                                    },
                                }),
                                options: {
                                    "Content-Disposition": 'form-data; name="metadata"',
                                    "Content-Type": "application/json; charset=UTF-8",
                                },
                            },
                            audio: {
                                value: file,
                                options: {
                                    "Content-Type": "audio/L16; rate=16000; channels=1",
                                    "Content-Disposition": 'form-data; name="audio"',
                                },
                            },
                        },
                    },
                    (err, response, body) => {
                        if (err !== null) {
                            reject(err);
                            return;
                        }

                        if (response.statusCode < 200 || response.statusCode >= 300) {
                            reject(body);
                            return;
                        }

                        var parsedMessage = httpMessageParser(body);
                        console.log('headers: ' + JSON.stringify(response.headers))
                        if (parsedMessage.multipart) {
                            if (parsedMessage.multipart.length > 2) {
                                console.log(`WARNING: More than 2 parts were found in API response, only returning the first application/json part`);
                            }

                            for (var i=0; i<parsedMessage.multipart.length; i++) {
                                var part = parsedMessage.multipart[i];
                                var contentType = null;
                                if (part && part.headers) {
                                    var contentType = part.headers['Content-Type'];
                                    console.log('contentType: ' + contentType);
                                }

                                if (contentType == 'application/json') {
                                    var content = part.body.toString();
                                    console.log("content: " + content)
                                    var json = JSON.parse(content);
                                    console.log('json: ' + JSON.stringify(json, null, 4));
                                    resolve(json);
                                    break
                                }
                            }
                        }
                    },
                )
                .pipe(stream);

            stream.on("finish", () => {
                if (stream.bytesWritten === 0) {
                    fs.unlink(path.resolve(__dirname, "temp/output.mpeg"), () => {
                        resolve();
                    });
                    return;
                }
                resolve();
            });
        });
    }
}
