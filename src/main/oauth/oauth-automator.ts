const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });


export class OAuthAutomator {
    constructor() {
    }

    public login(): void {
        console.log("logging in");
        /*nightmare
            .goto("https://www.amazon.com/ap/oa?client_id=amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e&scope=alexa:all&response_type=code&redirect_uri=https://localhost:3000/authresponse")
            .wait("#zero_click_wrapper .c-info__title a")
            .end()
            .then(function (result: any) {
                console.log(result);
            })
            .catch(function (error: any) {
                console.error("Search failed:", error);
            });*/
    }
}
