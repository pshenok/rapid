import joi from '../../../app/Validator';
import {handler} from '../decorators';


export class PingController {

	@handler({
		description: 'Simple ping',
		method:      'GET',
		path:        '/ping',
		validate:    {},
		response:    {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async simplePing (): Promise<object> {
		return {
			ping: 'pong',
			time: new Date().toISOString(),
		};
	}

	@handler({
		description: 'Simple ping',
		method:      'POST',
		path:        '/ping',
		validate:    {
			body: joi.object().keys({
				str: joi.string(),
			}),
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					ping: joi.string(),
					time: joi.string(),
				}),
			}),
		},
	})
	public async postPing (): Promise<object> {
		return {
			ping: 'pong',
			time: new Date().toISOString(),
		};
	}
}
