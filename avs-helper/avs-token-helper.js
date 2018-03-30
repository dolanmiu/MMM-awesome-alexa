"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const generateQuery = (params) => Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");
console.log("Welcome to the Amazon auth helper!");
console.log("I will need three things from you:");
console.log("- Client ID");
console.log("- Product ID");
console.log("- Allowed return URL");
common_1.prompt("[Press any key to continue]").then(() => {
    common_1.prompt("Client ID?").then(clientId => {
        common_1.prompt("Product Id?").then(productId => {
            common_1.prompt("Redirect URI (allowed return URL)?").then(redirectURI => {
                const scopeData = {
                    "alexa:all": {
                        productID: productId,
                        productInstanceAttributes: {
                            deviceSerialNumber: 123,
                        },
                    },
                };
                const getParams = generateQuery({
                    client_id: clientId,
                    scope: "alexa:all",
                    scope_data: JSON.stringify(scopeData),
                    response_type: "code",
                    redirect_uri: redirectURI,
                });
                console.log("Great! Copy paste the link below to your browser to authorize your Alexa product");
                console.log(`https://www.amazon.com/ap/oa?${getParams}`);
                process.exit();
            });
        });
    });
});
