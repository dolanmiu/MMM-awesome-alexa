interface IExtendedConfig extends Config {
    accessToken?: string;
}
export class ConfigService {
    public static config: IExtendedConfig;
}
