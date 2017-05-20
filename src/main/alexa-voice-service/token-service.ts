import * as request from "request";

import { IAVSOptions } from "./avs-options";

export class TokenService {

    public refreshToken(options: IAVSOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const grantType = "refresh_token";
            const postData = `grant_type=${grantType}&refresh_token=${options.refreshToken}&client_id=${options.clientId}&client_secret=${options.clientSecret}&redirect_uri=${encodeURIComponent(options.redirectUrl)}`;

            request.post({
                uri: "https://api.amazon.com/auth/o2/token",
                json: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: postData,
            }, (err, response, body) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(body);
                    return;
                }

                console.log(body);

                resolve(body);

                // const token = response.access_token;
                // const refreshToken = response.refresh_token;

                // this.setToken(token);
                // this.setRefreshToken(refreshToken);

                // return resolve(token);
            });
        });
    }
}
