const fs = require("fs");
const NodeHelper = require("node_helper");
const Main = require("./dist/main");
const path = require("path");

let main;

module.exports = NodeHelper.create({
    start: function () {
        this.expressApp.get("/output.mpeg", function (req, res) {
            res.setHeader("Expires", new Date().toUTCString());
            const outputPath = path.resolve(__dirname, 'temp/output.mpeg');

            if (!fs.existsSync(outputPath)) {
                const rstream = fs.createReadStream(path.resolve(__dirname, 'resources/alexa/sorry-im-not-sure.mpeg'));
                rstream.pipe(res);
                return;
            }

            const rstream = fs.createReadStream(outputPath);
            rstream.pipe(res);
        });

        this.expressApp.get("/med_ui_wakesound.wav", function(req, res) {
            fs.createReadStream(path.resolve(__dirname, "resources/med_ui_wakesound.wav"))
            .pipe(res);
        });
    },

    socketNotificationReceived: function (notification, payload) {
        // Renderer sends "main" a notification to connect
        if (notification === "CONFIG") {
            main = new Main(payload, (event, payload) => {
                this.sendSocketNotification(event, payload);
            }, this.socketNotificationReceived);
            return;
        }

        main.receivedNotification(notification, payload);
    },
});
