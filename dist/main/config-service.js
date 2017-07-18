"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigService {
    constructor(config) {
        this.config = config;
    }
    get Config() {
        return this.config;
    }
}
exports.ConfigService = ConfigService;
