/* global Module */

/* Magic Mirror
 * Module: MMM-Awesome-Alexa
 *
 * By Dolan Miu http://www.dolan.bio
 * MIT Licensed.
 */

let alexaMirror;

Module.register("MMM-awesome-alexa", {

    // Default module config.
    defaults: {
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
    },

    start: function () {
        if (this.config.refreshToken === undefined) {
            throw new Error("Refresh token must be set in the config before using this!");
        }
        // Needed to initially connect to node_helper;
        this.sendSocketNotification("CONNECT_TEST", {});
        this.sendSocketNotification("WAKE_WORD", this.config.wakeWord);
        this.sendSocketNotification("CONFIG", this.config);
    },

    getDom: function () {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");

        const alexaVisualiserCanvas = document.createElement("canvas");
        alexaVisualiserCanvas.width = 400;
        alexaVisualiserCanvas.height = 300;
        alexaWrapper.appendChild(alexaVisualiserCanvas);

        // alexaMirror = new AlexaVoiceService.AlexaMirror(alexaWrapper, alexaVisualiserCanvas, this.config);

        // alexaMirror.start();
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
