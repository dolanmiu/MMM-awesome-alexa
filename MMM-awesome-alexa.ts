declare const Module: {
  register(moduleName: string, moduleProperties: object): void,
};

declare const Log: {
  log(text: string): void,
};

interface IConfig {
    lite: boolean;
    isWakeUpSoundEnabled: boolean;
}

enum AlexaNotification {
    Idle = "idle",
    Listening = "listening",
    Busy = "busy",
    Speaking = "speak",
}

let texts: Array<string> = [];

Module.register("MMM-awesome-alexa", {

    // Default module config.
    defaults: {
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
        lite: false,
        isWakeUpSoundEnabled: true,
    },

    start: function(): void {
        if (this.config.refreshToken === undefined) {
            texts.push("Refresh token must be set in the config before using awesome-alexa!");
        }
        this.sendSocketNotification("CONFIG", this.config);
    },

    getDom: function(): HTMLElement {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");
        alexaWrapper.classList.add("wrapper");
        const spinner = this.createLoadingSpinner();
        const alexaCircle = document.createElement("div");
        alexaCircle.classList.add("alexa-circle");
        alexaWrapper.appendChild(spinner);
        alexaWrapper.appendChild(alexaCircle);

        if (texts.length > 0) {
            alexaWrapper.classList.add("wrapper-error");

            for (const text of texts) {
                alexaWrapper.appendChild(document.createTextNode(text));
            }
        }

        this.mainDiv = alexaWrapper;
        this.alexaCircle = alexaCircle;

        return alexaWrapper;
    },

    getStyles: function() {
        return [
            this.file("styles/global.css"),
        ];
    },

    socketNotificationReceived: function<T>(notification: AlexaNotification, payload: T): void {
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        switch (notification) {
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
    },

    idle: function(): void {
        if (!this.config.lite) {
            this.mainDiv.classList.remove("wrapper-active");
        }
    },

    listening: function(): void {
        if (this.config.isWakeUpSoundEnabled) {
            new Audio("/med_ui_wakesound.wav").play();
        }
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--listening");
            this.mainDiv.classList.add("wrapper-active");
        } else {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    },

    busy: function(): void {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--busy");
        }
    },

    speaking: function(): void {
        const sound = new Audio("/output.mpeg");
        sound.play();
        sound.addEventListener("ended", () => {
            this.sendSocketNotification("finishedSpeaking", {});
        });

        if (this.config.lite) {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        } else {
            this.alexaCircle.classList.remove("alexa-circle--busy", "alexa-circle--listening");
        }
    },

    createLoadingSpinner: function() {
        const img = document.createElement("img");
        img.setAttribute("src", "modules/MMM-awesome-alexa/styles/loading.gif");
        img.setAttribute("id", "loading-spinner");
        img.classList.add("loading-spinner");
        img.classList.add("hidden");
        return img;
    },
});
