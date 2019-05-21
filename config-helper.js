const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const request = require("request-promise");
const CLI = require("clui");

const spinner = new CLI.Spinner("Getting response from Amazon...");

const questions = [
    {
        name: "clientId",
        type: "input",
        message: "Enter your Client ID from Alexa Voice Service (AVS):",
        validate: value => {
            if (value.length) {
                return true;
            } else {
                return "Please enter your Client ID.";
            }
        },
    },
    {
        name: "clientSecret",
        type: "input",
        message: "Enter your Client Secret from Alexa Voice Service (AVS):",
        validate: function(value) {
            if (value.length) {
                return true;
            } else {
                return "Please enter your Client Secret.";
            }
        },
    },
    {
        name: "productId",
        type: "input",
        message: "Enter your Product ID from Alexa Voice Service (AVS):",
        validate: function(value) {
            if (value.length) {
                return true;
            } else {
                return "Please enter your Product ID.";
            }
        },
    },
    {
        name: "redirectUri",
        type: "input",
        message: "Enter your Redirect URI (allowed return URL) from Alexa Voice Service (AVS):",
        validate: function(value) {
            const pattern = new RegExp(
                "^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                    "(\\#[-a-z\\d_]*)?$",
                "i", // fragment locator
            );

            if (!!pattern.test(value)) {
                return true;
            } else {
                return "Invalid. Please enter your Redirect URI.";
            }
        },
    },
];

const authCodeQuestion = [
    {
        name: "authCode",
        type: "input",
        message: "Enter your Authorization code (from previous step):",
        validate: value => {
            if (value.length) {
                return true;
            } else {
                return "Please enter your Authorization Code.";
            }
        },
    },
];

const continueQuestion = [
    {
        name: "continue",
        type: "confirm",
        message: "Do you wish to continue to generate the MagicMirror config?",
        default: true,
    },
];

const configQuestions = [
    {
        name: "wakeWord",
        type: "list",
        message: "What do you want your Wake Word to be? (The phrase used to activate this module)",
        choices: ["Alexa", "Smart Mirror", "Snowboy"],
    },
    {
        name: "liteMode",
        type: "confirm",
        message: "Do you want to use lite mode?",
        default: false,
    },
    {
        name: "useVisualization",
        type: "confirm",
        message: "Do you want to use visulization?",
        default: true,
    },
];

const generateQuery = params =>
    Object.keys(params)
        .map(key => key + "=" + params[key])
        .join("&");

clear();

console.log(chalk.yellow(figlet.textSync("Awesome Alexa", { horizontalLayout: "full" })));

console.log(chalk.underline("Welcome to the Config Helper tool!"));
console.log("This tool will help you get the Refresh Token needed to run MMM-awesome-alexa.");
console.log(
    "It will optionally generate your config for you, if you wish. If not, you can still create it manually after.",
);
console.log("Go to https://developer.amazon.com/alexa/console/avs/products to get the details.\n");

const run = async () => {
    const output = await inquirer.prompt(questions);

    const scopeData = {
        "alexa:all": {
            productID: output.productId,
            productInstanceAttributes: {
                deviceSerialNumber: 123, // Can be anything
            },
        },
    };

    const queryParams = generateQuery({
        client_id: output.clientId,
        scope: "alexa:all",
        scope_data: JSON.stringify(scopeData),
        response_type: "code",
        redirect_uri: output.redirectUri,
    });

    console.log(
        chalk.blue("Hooray! Link is generated. Part 1 is done. Please go on the link below.\n"),
    );
    console.log(
        chalk.yellow("Please be aware that at the end,"),
        chalk.bgRed("THERE WILL BE AN ERROR!"),
        chalk.green("This is normal.\n"),
    );

    console.log(`https://www.amazon.com/ap/oa?${queryParams}`);

    console.log("\n^^^ Copy and paste the above in your Browser ^^^, follow the instructions.");
    console.log(
        "The authorization code you want is in the address bar in the final screen: https://imgur.com/a/6DbYlKA",
    );

    const authOutput = await inquirer.prompt(authCodeQuestion);

    spinner.start();

    const amazonTokenReponse = await request.post("https://api.amazon.com/auth/o2/token", {
        form: {
            grant_type: "authorization_code",
            code: authOutput.authCode,
            client_id: output.clientId,
            client_secret: output.clientSecret,
            redirect_uri: output.redirectUri,
        },
        json: true,
    });

    spinner.stop();
    console.log(
        chalk.bgGreen(
            "\nComplete! Your refresh token should be in the Amazon response below. If not raise an issue:\n",
        ),
    );
    console.dir(amazonTokenReponse, { colors: true });

    const continueOutput = await inquirer.prompt(continueQuestion);

    if (!continueOutput.continue) {
        process.exit();
    }

    const configOutput = await inquirer.prompt(configQuestions);

    console.log(chalk.green("\nCongrats! Here is the full config:\n"));
    console.dir(
        {
            module: "MMM-awesome-alexa",
            position: "bottom_bar",
            config: {
                wakeWord: configOutput.wakeWord,
                clientId: output.clientId,
                clientSecret: output.clientSecret,
                deviceId: output.productId,
                refreshToken: amazonTokenReponse.refresh_token,
                lite: configOutput.liteMode,
                isSpeechVisualizationEnabled: configOutput.useVisualization,
            },
        },
        { colors: true },
    );
};

run();
