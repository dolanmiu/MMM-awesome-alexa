const NodeHelper = require("node_helper");
const Main = require("./dist/main/index.js");

module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        // Renderer sends 'main' a notification to connect
    },

    start: function () {
        const main = new Main(() => {
            console.log("sending notif");
            console.log(this.sendSocketNotification);
            this.sendSocketNotification("noobs", {});
        });
    },
});
