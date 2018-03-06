// tslint:disable-next-line:no-require-imports
import open = require("open");

const generateQuery = (params: { [key: string]: string }) =>
    Object.keys(params)
        .map((key: string) => key + "=" + params[key])
        .join("&");

const getParams = generateQuery({
    client_id: "lol",
    scope: "lol",
    scope_data: "lol",
    response_type: "lol",
    redirect_uri: "lol",
});

const authUrl = `https://www.amazon.com/ap/oa?${getParams}`;

open(authUrl);
