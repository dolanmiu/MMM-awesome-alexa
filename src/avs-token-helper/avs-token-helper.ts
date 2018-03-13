// tslint:disable-next-line:no-require-imports
import opn = require("opn");
import { prompt } from "./common";

const generateQuery = (params: { [key: string]: string }) =>
    Object.keys(params)
        .map((key: string) => key + "=" + params[key])
        .join("&");

console.log("Welcome to the Amazon auth helper!");
console.log("I will need three things from you:");
console.log("- Client ID");
console.log("- Product ID");
console.log("- Allowed return URL");

prompt("[Press any key to continue]").then(() => {
    prompt("Client ID?").then(clientId => {
        prompt("Product Id?").then(productId => {
            prompt("Redirect URI (allowed return URL)?").then(redirectURI => {
                const scopeData = {
                    "alexa:all": {
                        productID: productId,
                        productInstanceAttributes: {
                            deviceSerialNumber: 123, // can be anything
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
                    prompt(
                        "Great! Next I will show you a link. Copy and paste this into your browser to authorize your Alexa product\n[Press any key to continue]",
                    ).then(() => {
                        console.log(authUrl);
                    });
                } else {
                    prompt(
                        "Great! Next I will now open a browser where you can authorize your Alexa product\n[Press any key to continue]",
                    ).then(() => {
                        opn(authUrl)
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
