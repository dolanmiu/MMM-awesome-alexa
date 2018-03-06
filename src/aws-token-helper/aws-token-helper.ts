// tslint:disable-next-line:no-require-imports
import open = require("open");

const generateQuery = (params: { [key: string]: string }) =>
    Object.keys(params)
        .map((key: string) => key + "=" + encodeURIComponent(params[key]))
        .join("&");

function prompt(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const stdin = process.stdin;
        const stdout = process.stdout;

        stdin.resume();
        stdout.write(question + " ");

        stdin.once("data", data => {
            resolve(data.toString().trim());
        });
    });
}

prompt("Client ID?").then(clientId => {
    prompt("Product Id?").then(productId => {
        const deviceSerialNumber = 123; // can be anything
        const scopeData = {
            "alexa:all": {
                productID: productId,
                productInstanceAttributes: {
                    deviceSerialNumber: deviceSerialNumber,
                },
            },
        };
        const getParams = generateQuery({
            client_id: clientId,
            scope: "alexa:all",
            scope_data: JSON.stringify(scopeData),
            response_type: "code",
            redirect_uri: "https://localhost:9745/authresponse",
        });

        const authUrl = `https://www.amazon.com/ap/oa?${getParams}`;

        open(authUrl);
        process.exit();
    });
});
