"use strict";
exports.__esModule = true;
// tslint:disable-next-line:no-require-imports
var opn = require("opn");
var common_1 = require("./common");
var generateQuery = function(params) {
    return Object.keys(params)
        .map(function(key) {
            return key + "=" + params[key];
        })
        .join("&");
};
console.log("Welcome to the Amazon auth helper!");
console.log("I will need three things from you:");
console.log("- Client ID");
console.log("- Product ID");
console.log("- Allowed return URL");
common_1.prompt("[Press any key to continue]").then(function() {
    common_1.prompt("Client ID?").then(function(clientId) {
        common_1.prompt("Product Id?").then(function(productId) {
            common_1.prompt("Redirect URI (allowed return URL)?").then(function(redirectURI) {
                common_1
                    .prompt(
                        "Great! Next I will now open a browser where you can authorize your Alexa product\n[Press any key to continue]",
                    )
                    .then(function() {
                        var scopeData = {
                            "alexa:all": {
                                productID: productId,
                                productInstanceAttributes: {
                                    deviceSerialNumber: 123,
                                },
                            },
                        };
                        var getParams = generateQuery({
                            client_id: clientId,
                            scope: "alexa:all",
                            scope_data: JSON.stringify(scopeData),
                            response_type: "code",
                            redirect_uri: redirectURI,
                        });
                        var authUrl = "https://www.amazon.com/ap/oa?" + getParams;
                        opn(authUrl).then(function() {
                            process.exit();
                        });
                    });
            });
        });
    });
});
