interface Config {
    wakeWord: string;
    clientId: string;
    clientSecret: string;
    deviceId: string;
    refreshToken: string;
    lite: boolean;
    visualization: boolean;
}

interface UncheckedConfig {
    wakeWord?: string;
    clientId?: string;
    clientSecret?: string;
    deviceId?: string;
    refreshToken?: string;
    lite?: boolean;
    visualization?: boolean;
}
