declare module "node_helper" {
    export function create(config: {
        start(): void;
        socketNotificationReceived<T>(notification: NotificationType, payload: T): void;
        [key: string]: {};
    }): void;
}
