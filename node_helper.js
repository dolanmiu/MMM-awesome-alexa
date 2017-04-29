const NodeHelper = require("node_helper");
const Main = require("./dist/main/index.js");

module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        // Renderer sends "main" a notification to connect
    },

    start: function () {
        this.expressApp.get("/parse-m3u", function (req, res) {
            const m3uUrl = req.query.url;

            if (!m3uUrl) {
                return res.json([]);
            }

            const urls = [];

            request(m3uUrl, function (error, response, bodyResponse) {
                if (bodyResponse) {
                    urls.push(bodyResponse);
                }

                res.json(urls);
            });
        });
    },

    // Because this.config is not accessible from node_helper for some reason. Need to pass from the js file.
    socketNotificationReceived: function (notification, payload) {
        if (notification !== "WAKE_WORD") {
            return;
        }

        const main = new Main(payload, () => {
            this.sendSocketNotification("hotword", {});
        });
    },
});
