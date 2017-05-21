interface Config {
    wakeWord: string;
    clientId: string;
    clientSecret: string;
    deviceId: string;
    refreshToken: string;
}

interface UncheckedConfig {
    wakeWord?: string;
    clientId?: string;
    clientSecret?: string;
    deviceId?: string;
    refreshToken?: string;
}