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

    start: function () {
        // Needed to initially connect to node_helper;
        this.sendSocketNotification("ADD_FEED", { "test": "test" });
        var avs = new AlexaVoiceService.AVSWrapper();
        avs.init();
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
            this.file("dist/bundle.js"),
        ];
    },

    getStyles: function () {
        return [
            this.file("styles/global.css"),
        ];
    },

    socketNotificationReceived: function (notification, payload) {
        //if (notification.startsWith('ALEXA_')) {
        console.log("notification received");
        console.log(notification);
        console.log(payload);
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        alert(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        //}
    },
});
