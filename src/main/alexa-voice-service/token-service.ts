import * as request from "request";

import { IAVSOptions } from "./avs-options";

interface IAmazonTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
}

export class TokenService {

    public refreshToken(options: IAVSOptions): Promise<IAmazonTokenResponse> {
        return new Promise<IAmazonTokenResponse>((resolve, reject) => {
            if (options.redirectUrl === undefined) {
                throw new Error("redirectUrl required");
            }

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
}
