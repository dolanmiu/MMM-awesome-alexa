"use strict";
exports.__esModule = true;
var request = require("request");
var common_1 = require("./common");
console.log("Welcome to the Amazon auth helper!");
console.log("I will need four things from you:");
console.log("- Authorization code from previous step");
console.log("- Client ID");
console.log("- Client secret");
console.log("- Allowed return URL");
common_1.prompt("[Press any key to continue]").then(function () {
    common_1.prompt("Authorization code (from previous step)?").then(function (authorizationCode) {
        common_1.prompt("Client ID?").then(function (clientId) {
            common_1.prompt("Client secret?").then(function (clientSecret) {
                common_1.prompt("Redirect URI (allowed return URL)?").then(function (redirectURI) {
                    request.post("https://api.amazon.com/auth/o2/token", {
                        form: {
                            grant_type: "authorization_code",
                            code: authorizationCode,
                            client_id: clientId,
                            client_secret: clientSecret,
                            redirect_uri: redirectURI
                        }
                    }, function (error, response, body) {
                        console.dir(JSON.parse(body), { colors: true });
                        process.exit();
                    });
                });
            });
        });
    });
});
