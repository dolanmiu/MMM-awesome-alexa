import { Models } from "snowboy";

export class AlexaModels extends Models {
    constructor(cwd: string) {
        super();

        this.add({
            file: cwd + "/resources/snowboy.umdl",
            sensitivity: "0.5",
            hotwords: "snowboy"
        });
    }
}
