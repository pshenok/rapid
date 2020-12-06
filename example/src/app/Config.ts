import {AbstractConfig} from './base/AbstractConfig';

const WEB_PORT = 3000;
const BODY_LIMIT = 10485760; // 10 MB;

export class Config extends AbstractConfig {
	public web = {
		port:       this.getNumber('WEB_PORT', WEB_PORT),
		bodyLimit:  this.getNumber('BODY_LIMIT', BODY_LIMIT),
		appUrl:     this.getString('APP_URL', 'localhost:3000'),
		corsOrigin: this.getString('WEB_CORS_ORIGIN', '*'),
		apiPath:    this.getString('WEB_API_PATH', '/api/'),
	};
	public logger = {
		loggingType: this.getString('LOGGING_TYPE', 'json'),
	};;
}
