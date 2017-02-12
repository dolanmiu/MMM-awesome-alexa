declare module "snowboy" {
    export class Detector {
        constructor(params: any);

        on(event: string, callback: (index?: any, hotword?: any) => void): void;
    }

    export class Models {
        add(params: any): void;
    }
}