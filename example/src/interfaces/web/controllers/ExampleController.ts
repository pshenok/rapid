import joi from '../../../app/Validator';
import {Request} from 'express';
import {handler} from '../decorators';


export class ExampleController {

	constructor () {}

	@handler({
		description: 'Example GET request',
		method:      'GET',
		path:        '/examples',
		validate:    {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					name: joi.string().required(),
				}),
			}),
		}
	})
	public async handleExampleEndpoint (req: Request): Promise<any> {
		return {
			name: 'Snappy API'
		}
	}
}
