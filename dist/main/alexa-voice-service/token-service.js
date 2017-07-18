"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const Observable_1 = require("rxjs/Observable");
class TokenService {
    constructor(options) {
        this.observable = new Observable_1.Observable((observer) => {
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
    obtainToken(options) {
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
                if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
                    reject(body);
                    return;
                }
                resolve(body);
            });
        });
    }
    get Observable() {
        return this.observable;
    }
}
exports.TokenService = TokenService;
