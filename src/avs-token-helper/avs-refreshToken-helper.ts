import * as request from "request";
import { prompt } from "./common";

console.log("Welcome to the Amazon auth helper!");
console.log("I will need four things from you:");
console.log("- Authorization code from previous step");
console.log("- Client ID");
console.log("- Client secret");
console.log("- Allowed return URL");

prompt("[Press any key to continue]").then(() => {
    prompt("Authorization code (from previous step)?").then(authorizationCode => {
        prompt("Client ID?").then(clientId => {
            prompt("Client secret?").then(clientSecret => {
                prompt("Redirect URI (allowed return URL)?").then(redirectURI => {
                    request.post(
                        "https://api.amazon.com/auth/o2/token",
                        {
                            form: {
                                grant_type: "authorization_code",
                                code: authorizationCode,
                                client_id: clientId,
                                client_secret: clientSecret,
                                redirect_uri: redirectURI,
                            },
                        },
                        (error, response, body) => {
                            console.dir(JSON.parse(body), { colors: true });
                            process.exit();
                        },
                    );
                });
            });
        });
    });
});
