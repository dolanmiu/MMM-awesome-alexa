import { Models } from "snowboy";

import { MODELS } from "./model-dictionary";

export class AlexaModels extends Models {
    constructor(wakeWord: string) {
        super();

        let model = MODELS[wakeWord];
        if (model === undefined) {
            console.error(`model ${wakeWord} is not found, so using Alexa instead`);
            model = MODELS.Alexa;
        }

        this.add({
            file: `${process.env.CWD}/resources/models/${model.file}`,
            sensitivity: "0.5",
            hotwords: model.name,
        });
    }
}
