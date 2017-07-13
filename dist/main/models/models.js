"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snowboy_1 = require("snowboy");
const model_dictionary_1 = require("./model-dictionary");
class AlexaModels extends snowboy_1.Models {
    constructor(wakeWord) {
        super();
        let model = model_dictionary_1.MODELS[wakeWord];
        if (model === undefined) {
            console.error(`model ${wakeWord} is not found, so using Alexa instead`);
            model = model_dictionary_1.MODELS.Alexa;
        }
        this.add({
            file: `${process.env.CWD}/resources/models/${model.file}`,
            sensitivity: "0.5",
            hotwords: model.name,
        });
    }
}
exports.AlexaModels = AlexaModels;
