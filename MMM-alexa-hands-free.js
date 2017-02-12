/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-alexa-hands-free", {

    // Default module config.
    defaults: {
        text: "Hello World!"
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.setAttribute("id", "wrapper");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    },

    getStyles: function () {
        return [
            this.file('styles/global.css'), // will try to load it from the vendor folder, otherwise it will load is from the module folder.
        ]
    }
});