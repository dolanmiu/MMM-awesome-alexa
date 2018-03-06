"use strict";
exports.__esModule = true;
// tslint:disable-next-line:no-require-imports
var open = require("open");
var generateQuery = function (params) {
    return Object.keys(params)
        .map(function (key) { return key + "=" + params[key]; })
        .join("&");
};
function prompt(question) {
    return new Promise(function (resolve, reject) {
        var stdin = process.stdin;
        var stdout = process.stdout;
        stdin.resume();
        stdout.write(question + " ");
        stdin.once("data", function (data) {
            resolve(data.toString().trim());
        });
    });
}
console.log("Welcome to the Amazon auth helper!");
console.log("I will need three things from you:");
console.log("- Client ID");
console.log("- Product ID");
console.log("- Allowed return URL");
prompt("[Press any key to continue]").then(function () {
    prompt("Client ID?").then(function (clientId) {
        prompt("Product Id?").then(function (productId) {
            prompt("Redirect URI (allowed return URL)?").then(function (redirectURI) {
                prompt("Great! Next I will now open a browser where you can authorize your Alexa product\n[Press any key to continue]").then(function () {
                    var scopeData = {
                        "alexa:all": {
                            productID: productId,
                            productInstanceAttributes: {
                                deviceSerialNumber: 123
                            }
                        }
                    };
                    var getParams = generateQuery({
                        client_id: clientId,
                        scope: "alexa:all",
                        scope_data: JSON.stringify(scopeData),
                        response_type: "code",
                        redirect_uri: redirectURI
                    });
                    var authUrl = "https://www.amazon.com/ap/oa?" + getParams;
                    open(authUrl);
                    process.exit();
                });
            });
        });
    });
});
