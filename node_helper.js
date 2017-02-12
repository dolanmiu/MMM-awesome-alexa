const NodeHelper = require("node_helper");
const Main = require("./dist/main/index.js");

module.exports = NodeHelper.create({
    start: function () {
        var self = this;
        console.log(Main);
        const main = new Main(() => {
            console.log("sending notif");
            console.log(self.sendSocketNotification);
            self.sendSocketNotification("noobs", "hello");
        });
    },
});
