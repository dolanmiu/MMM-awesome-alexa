declare interface MagicMirrorModule {
    defaults: { [key: string]: any };
    start: Function;
    getDom: Function;
    getScripts: Function;
    getStyles: Function;
    socketNotificationReceived: Function;
}