import { AbstractConfig } from "./AbstractConfig";

const WEB_PORT = 3000;
const BODY_LIMIT = 10485760; // 10 MB;

export class Config extends AbstractConfig {
	public web = {
		port: this.getNumber("WEB_PORT", WEB_PORT),
		bodyLimit: this.getNumber("BODY_LIMIT", BODY_LIMIT),
		appUrl: this.getString("APP_URL", "localhost:3000"),
		corsOrigin: this.getString("WEB_CORS_ORIGIN", "*"),
		apiPath: this.getString("WEB_API_PATH", "/api/")
	};
	public infra = {
		db: {
			host: this.getString("DB_HOST"),
			port: this.getNumber("DB_PORT"),
			db: this.getString("DB_DB"),
			user: this.getString("DB_USER"),
			pass: this.getString("DB_PASS"),
			dialect: this.getString("DB_DIALECT"),
			read: {
				hosts: this.getArrayString("DB_READ_HOSTS", []),
				ports: this.getArrayNumber("DB_READ_PORTS", [])
			}
		}
	};
	public logger = {
		loggingType: this.getString("LOGGING_TYPE", "json")
	};
}
