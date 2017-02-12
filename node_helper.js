const NodeHelper = require("node_helper");
// const electronMain = require("./dist/main");
const e = require("./dist/bundle.js");

module.exports = NodeHelper.create({
    start: function () {
        console.log('CONFURING');
    }
});
