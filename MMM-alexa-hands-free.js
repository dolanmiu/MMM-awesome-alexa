/* global Module */

/* Magic Mirror
 * Module: MMM-Awesome-Alexa
 *
 * By Dolan Miu http://www.dolan.bio
 * MIT Licensed.
 */

let alexaMirror;

Module.register("MMM-alexa-hands-free", {

    // Default module config.
    defaults: {
        text: "Hello World!",
    },

    start: function () {
        // Needed to initially connect to node_helper;
        this.sendSocketNotification("CONNECT_TEST", {});
    },

    getDom: function () {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");

        const alexaVisualiserCanvas = document.createElement("canvas");
        alexaVisualiserCanvas.width = 400;
        alexaVisualiserCanvas.height = 300;
        alexaWrapper.appendChild(alexaVisualiserCanvas);

        alexaMirror = new AlexaVoiceService.AlexaMirror(alexaWrapper, alexaVisualiserCanvas);

        alexaMirror.start();
        return alexaWrapper;
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
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        alexaMirror.receivedNotification(notification, payload);
    },
});
