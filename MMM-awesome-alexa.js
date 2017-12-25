var AlexaNotification;
(function (AlexaNotification) {
    AlexaNotification["Idle"] = "idle";
    AlexaNotification["Listening"] = "listening";
    AlexaNotification["Busy"] = "busy";
    AlexaNotification["Speaking"] = "speak";
})(AlexaNotification || (AlexaNotification = {}));
var AlexaMirror = /** @class */ (function () {
    function AlexaMirror(mainDiv, canvas, config, mainSend, alexaCircle) {
        this.mainDiv = mainDiv;
        this.config = config;
        this.mainSend = mainSend;
        this.alexaCircle = alexaCircle;
        if (this.config.lite) {
            alexaCircle.remove();
        }
    }
    AlexaMirror.prototype.receivedNotification = function (type, payload) {
        switch (type) {
            case AlexaNotification.Idle:
                this.idle();
                break;
            case AlexaNotification.Listening:
                this.listening();
                break;
            case AlexaNotification.Busy:
                this.busy();
                break;
            case AlexaNotification.Speaking:
                this.speaking();
                break;
        }
    };
    AlexaMirror.prototype.listening = function () {
        if (this.config.isWakeUpSoundEnabled) {
            new Audio("/med_ui_wakesound.wav").play();
        }
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--listening");
            this.mainDiv.classList.add("wrapper-active");
        }
        else {
            var spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    };
    AlexaMirror.prototype.idle = function () {
        if (!this.config.lite) {
            this.mainDiv.classList.remove("wrapper-active");
        }
    };
    AlexaMirror.prototype.busy = function () {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--busy");
        }
    };
    AlexaMirror.prototype.speaking = function () {
        var _this = this;
        var sound = new Audio("/output.mpeg");
        sound.play();
        sound.addEventListener("ended", function () {
            _this.mainSend("finishedSpeaking", {});
        });
        if (this.config.lite) {
            var spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        }
        else {
            this.alexaCircle.classList.remove("alexa-circle--busy", "alexa-circle--listening");
        }
    };
    return AlexaMirror;
}());
var alexaMirror;
var texts = [];
Module.register("MMM-awesome-alexa", {
    // Default module config.
    defaults: {
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
        lite: false,
        isWakeUpSoundEnabled: true
    },
    start: function () {
        if (this.config.refreshToken === undefined) {
            texts.push("Refresh token must be set in the config before using awesome-alexa!");
        }
        this.sendSocketNotification("CONFIG", this.config);
    },
    getDom: function () {
        var _this = this;
        var alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");
        alexaWrapper.classList.add("wrapper");
        var spinner = this.createLoadingSpinner();
        var alexaCircle = document.createElement("div");
        alexaCircle.classList.add("alexa-circle");
        alexaWrapper.appendChild(spinner);
        alexaWrapper.appendChild(alexaCircle);
        if (texts.length > 0) {
            alexaWrapper.classList.add("wrapper-error");
            for (var _i = 0, texts_1 = texts; _i < texts_1.length; _i++) {
                var text = texts_1[_i];
                alexaWrapper.appendChild(document.createTextNode(text));
            }
        }
        alexaMirror = new AlexaMirror(alexaWrapper, undefined, this.config, function (event, payload) {
            _this.sendSocketNotification(event, payload);
        }, alexaCircle);
        return alexaWrapper;
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
    createLoadingSpinner: function () {
        var img = document.createElement("img");
        img.setAttribute("src", "modules/MMM-awesome-alexa/styles/loading.gif");
        img.setAttribute("id", "loading-spinner");
        img.classList.add("loading-spinner");
        img.classList.add("hidden");
        return img;
    }
});
