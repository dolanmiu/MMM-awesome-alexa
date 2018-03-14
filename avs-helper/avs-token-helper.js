"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opn = require("opn");
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
                const authUrl = `https://www.amazon.com/ap/oa?${getParams}`;
                if (process.platform === "win32") {
                    common_1.prompt("Great! Next I will show you a link. Copy and paste this into your browser to authorize your Alexa product\n[Press any key to continue]").then(() => {
                        console.log(authUrl);
                    });
                }
                else {
                    common_1.prompt("Great! Next I will now open a browser where you can authorize your Alexa product\n[Press any key to continue]").then(() => {
                        opn(authUrl, { wait: false })
                            .then(() => {
                            process.exit();
                        })
                            .catch(err => {
                            console.error("Something went wrong with opening your browser");
                            console.error(err);
                        });
                    });
                }
            });
        });
    });
});
