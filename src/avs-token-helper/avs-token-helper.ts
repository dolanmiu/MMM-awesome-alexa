// tslint:disable-next-line:no-require-imports
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

                console.log(
                    "Great! Copy paste the link below to your browser to authorize your Alexa product",
                );
                console.log(`https://www.amazon.com/ap/oa?${getParams}`);
                process.exit();
            });
        });
    });
});
