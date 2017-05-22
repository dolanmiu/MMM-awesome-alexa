declare module "snowboy" {
    import { Stream } from "stream";
    
    export class Detector extends Stream {
        constructor(params: any);

        on(event: string | symbol, callback: (index?: any, hotword?: any) => void): this;
    }

    export class Models {
        add(params: any): void;
    }
}