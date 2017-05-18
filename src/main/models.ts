import { Models } from "snowboy";

export class AlexaModels extends Models {
    constructor(cwd: string, model: IModelFile) {
        super();

        this.add({
            file: `${cwd}/resources/models/${model.file}`,
            sensitivity: "0.5",
            hotwords: model.name,
        });
    }
}
