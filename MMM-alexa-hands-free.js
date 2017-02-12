/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Dolan Miu http://www.dolan.bio
 * MIT Licensed.
 */

Module.register("MMM-alexa-hands-free", {

    // Default module config.
    defaults: {
        text: "Hello World!",
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.setAttribute("id", "wrapper");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    },

    getScripts: function () {
        return [
            //this.file("dist/bundle.js"),
            //this.file("dist/main/index.js"),
        ];
    },

    getStyles: function () {
        return [
            this.file("styles/global.css"),
        ];
    },

    target: "electron-renderer",
});
