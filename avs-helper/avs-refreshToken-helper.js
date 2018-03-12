"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const common_1 = require("./common");
console.log("Welcome to the Amazon auth helper!");
console.log("I will need four things from you:");
console.log("- Authorization code from previous step");
console.log("- Client ID");
console.log("- Client secret");
console.log("- Allowed return URL");
common_1.prompt("[Press any key to continue]").then(() => {
    common_1.prompt("Authorization code (from previous step)?").then(authorizationCode => {
        common_1.prompt("Client ID?").then(clientId => {
            common_1.prompt("Client secret?").then(clientSecret => {
                common_1.prompt("Redirect URI (allowed return URL)?").then(redirectURI => {
                    request.post("https://api.amazon.com/auth/o2/token", {
                        form: {
                            grant_type: "authorization_code",
                            code: authorizationCode,
                            client_id: clientId,
                            client_secret: clientSecret,
                            redirect_uri: redirectURI,
                        },
                    }, (error, response, body) => {
                        console.dir(JSON.parse(body), { colors: true });
                        process.exit();
                    });
                });
            });
        });
    });
});
