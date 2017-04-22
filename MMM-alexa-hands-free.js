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
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
        refreshToken: "Atzr|IwEBILVXEPwQ1WBP0g28icIpbX8UnfwfeZ0U4ffd_uQz0txBZqS2NZ-F0Jl8iUKHasQDzdwhrgvIOz5uaTKED8ZYPMNpYjJz0tUz07j_Ba2M0Y0t3m-VU6n_dRdJ0N7y6xEDwXbIFDq-dQ_Ufe_OOlUGNEyXP3XyQD_kKyb4UX5sWAjrr_0i-CcOtUUsEieMEabgncpAm4ocRfa7NUR3SGBz9nPYnSbRMT8yDRaZRYJbz9voDWAl0LkIr1OMwHrM59YbKLu9IMtQya3JAJXpamsnjAaWS9NPQ7OLFcf5jAKZNd_T2-wIB-radH6tgE4SWuW-qUHemf_dB64YC6xdjeOqdT83G46BftK8omPOt57W3mwfNuclHICvWEacGJ3z4zJT5foaH-QZEMPZSAPwE9fIQ2AuBGqSB4qC7Acr9gWx0Fj-43mMzWxnFBe4m3yKaZOqjoCGJiMoCwJROq0VhiP4hn7NvCbAn93R4hb4_6go0e5ExLeAzeBbp5exRjf6GVX0-pifxq6XF3NrRaAeG0k67m-vy3gPjtEN0MutCdKQ8HAIFA"
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

        alexaMirror = new AlexaVoiceService.AlexaMirror(alexaWrapper, alexaVisualiserCanvas, this.config);

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
