import * as request from "request";
import { Observable } from "rxjs/Rx";

import { IAVSOptions } from "./avs-options";

interface IAmazonTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
}

export class TokenService {
    private observable: Observable<IAmazonTokenResponse>;

    constructor(options: IAVSOptions) {
        this.observable = new Observable<IAmazonTokenResponse>((observer) => {
            if (options.redirectUrl === undefined) {
                throw new Error("redirectUrl required");
            }

            this.obtainToken(options).then((token) => {
                observer.next(token);
            }).catch((err) => {
                throw new Error(err);
            });

            setInterval(() => {
                this.obtainToken(options).then((token) => {
                    observer.next(token);
                }).catch((err) => {
                    throw new Error(err);
                });
            }, 3000 * 1000);
        });
    }

    private obtainToken(options: IAVSOptions): Promise<IAmazonTokenResponse> {
        return new Promise<IAmazonTokenResponse>((resolve, reject) => {
            const grantType = "refresh_token";
            const postData = `grant_type=${grantType}&refresh_token=${options.refreshToken}&client_id=${options.clientId}&client_secret=${options.clientSecret}&redirect_uri=${encodeURIComponent(options.redirectUrl)}`;

            request.post({
                uri: "https://api.amazon.com/auth/o2/token",
                json: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: postData,
            }, (err, response, body: IAmazonTokenResponse) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
                    reject(body);
                    return;
                }

                resolve(body);
            });
        });
    }

    public get Observable(): Observable<IAmazonTokenResponse> {
        return this.observable;
    }
}
