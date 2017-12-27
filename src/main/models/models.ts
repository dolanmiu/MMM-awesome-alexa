import * as path from "path";
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
            file: path.resolve(__dirname, "resources/models", model.file),
            sensitivity: "0.5",
            hotwords: model.name,
        });
    }
}
