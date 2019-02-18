import CircleVisualizer from "./visualizer/circle-visualizer";

declare const Module: {
    register(moduleName: string, moduleProperties: object): void;
};

declare const Log: {
    log(text: string): void;
};

enum AlexaNotification {
    Idle = "idle",
    Listening = "listening",
    Busy = "busy",
    Speaking = "speak",
}

enum ImageSize {
    Small = "SMALL",
    Medium = "MEDIUM",
    Large = "LARGE",
    XLarge = "X-LARGE"
}

enum RenderTemplateType {
    TextOnly = "BodyTemplate1",
    TextAndImage = "BodyTemplate2",
    List = "ListTemplate",
    Weather = "Weather"
}

const texts: Array<string> = [];

const DisplayCardImgId: string = "display-card-image";

Module.register("MMM-awesome-alexa", {
    // Default module config.
    defaults: {
        clientId: "amzn1.application-oa2-client.81574bebfb25437595d7376f44b54f8e",
        clientSecret: "87d49f998b3a6507b8e6a08760cda274e1d44a22a2bebade9433b1e7445d66a5",
        deviceId: "magic_mirror_alexa",
        lite: false,
        isSpeechVisualizationEnabled: false,
        areDisplayCardsEnabled: true
    },

    start(): void {
        this.sendSocketNotification("CONFIG", this.config);
        this.canvas = this.createCanvas();
        if (this.config.isSpeechVisualizationEnabled) {
            this.visualizer = new CircleVisualizer(this.canvas);
        }
    },

    getDom(): HTMLElement {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");
        alexaWrapper.classList.add("wrapper");
        const spinner = this.createLoadingSpinner();
        const alexaCircle = document.createElement("div");
        alexaCircle.classList.add("alexa-circle");
        alexaWrapper.appendChild(spinner);
        alexaWrapper.appendChild(alexaCircle);
        alexaWrapper.appendChild(this.canvas);

        const cardImg = document.createElement("img");
        cardImg.setAttribute("id", DisplayCardImgId);
        cardImg.setAttribute("style", "position: absolute");
        cardImg.setAttribute("width", "40%");
        alexaWrapper.appendChild(cardImg);

        if (texts.length > 0) {
            alexaWrapper.classList.add("wrapper-error");

            for (const text of texts) {
                alexaWrapper.appendChild(document.createTextNode(text));
            }
        }

        this.alexaCircle = alexaCircle;
        this.mainDiv = alexaWrapper;

        return alexaWrapper;
    },

    getStyles(): Array<string> {
        return [this.file("styles/global.css")];
    },

    createLoadingSpinner(): HTMLElement {
        const img = document.createElement("img");
        img.setAttribute("src", "modules/MMM-awesome-alexa/styles/loading.gif");
        img.setAttribute("id", "loading-spinner");
        img.classList.add("loading-spinner");
        img.classList.add("hidden");
        return img;
    },

    createCanvas(): HTMLElement {
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        return canvas;
    },

    socketNotificationReceived<T>(notification: AlexaNotification, payload: T): void {
        Log.log(this.name + " received a notification: " + notification + " - Payload: " + JSON.stringify(payload));
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
                this.handleDirectives(payload);
                break;
        }
    },

    listening(): void {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--listening");
            this.mainDiv.classList.add("wrapper-active");
        } else {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.remove("hidden");
        }
    },

    idle(): void {
        if (!this.config.lite) {
            this.mainDiv.classList.remove("wrapper-active");
        }

        // remove the card once the speaking ends
        var currentCard = document.getElementById(DisplayCardImgId);
        if (currentCard) {
            currentCard.setAttribute("src", "");
        }
    },

    busy(): void {
        if (!this.config.lite) {
            this.alexaCircle.classList.add("alexa-circle--busy");
        }
    },

    speaking(): void {
        const sound = new Audio("/output.mpeg");
        if (this.config.isSpeechVisualizationEnabled) {
            this.visualizer.connect(sound);
            this.visualizer.start();
        }
        sound.play();
        sound.addEventListener("ended", () => {
            this.sendSocketNotification("finishedSpeaking", {});
            if (this.config.isSpeechVisualizationEnabled) {
                this.visualizer.stop();
            }
        });

        if (this.config.lite) {
            const spinner = document.getElementById("loading-spinner");
            spinner.classList.add("hidden");
        } else {
            this.alexaCircle.classList.remove("alexa-circle--busy", "alexa-circle--listening");
        }
    },

    handleDirectives(payload: any): void {
        console.log('handling directives')
        if (payload && payload.messageBody && payload.messageBody.directives) {
            var directives = payload.messageBody.directives;
            for (var i: number = 0; i<directives.length; i++) {
                var directive = directives[i];

                switch (directive.namespace) {
                    case 'TemplateRuntime':
                        this.renderTemplateDirective(directive);
                }
            }
        }
    },

    renderTemplateDirective(directive: any): void {
        // docs on template types: https://developer.amazon.com/docs/alexa-voice-service/templateruntime.html        
        if (directive.payload.type === RenderTemplateType.TextOnly) {
            console.log(`No rendering logic is implemented for ${RenderTemplateType.TextOnly}`);
        }
        else if (directive.payload.type === RenderTemplateType.TextAndImage) {
            var imageSources: Array<any> = directive.payload.image.sources;
            var image = imageSources.find(x => x.size === ImageSize.Large);
            if (!image) {
                image = imageSources.find(x => x.size === ImageSize.Medium);
            }

            var currentCard = document.getElementById(DisplayCardImgId);
            if (currentCard) {
                currentCard.setAttribute("src", image.url);
            }
            else {
                console.error('Could not find card container to update');
            }
        }
        else if (directive.payload.type === RenderTemplateType.List) {
            console.log(`No rendering logic is implemented for ${RenderTemplateType.List}`);
        }
        else if (directive.payload.type === RenderTemplateType.Weather) {
            console.log(`No rendering logic is implemented for ${RenderTemplateType.Weather}`);
        }
        else {
            console.log(`Unrecognized template: ${directive.template.type}`);
        }
    },

    getDirectiveHandler(namespace: string) {
        switch (namespace) {
            case 'TemplateRuntime':
                return this.renderTemplateDirective
        }
    }
});
