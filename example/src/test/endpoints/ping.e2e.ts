import {Tester} from '../Tester';
import joi from '../../app/Validator';


const tester = new Tester();

describe('GET /ping', function () {
	beforeAll(async () => {
		await tester.start();
	});

	afterAll(async () => {
		await tester.stop();
	});


	it('should return correct response', async () => {
		const resp = await tester.request('GET', '/ping');

		await joi.validate(resp, joi.object().keys({
			statusCode: 200,
			body:       {
				data: {
					ping: joi.string().valid('pong'),
					time: joi.date(),
				},
			},
		}), { allowUnknown: false, presence: 'required' });
	});

	it('should return 404 on wrong path', async () => {
		const resp = await tester.request('GET', '/ping/404');

		expect(resp.statusCode).toEqual(404);
		expect(resp.body).toEqual({
			statusCode: 404,
			error:      'NOT FOUND',
			message:    'Not Found',
		});
	});

	it('should not fail on superfluous query', async () => {
		const resp = await tester.request('GET', '/ping?x=100');

		expect(resp.statusCode).toEqual(200);
	});

	it('should fail on too big body', async () => {
		const resp = await tester.request('POST', '/ping', {
			body: {
				str: 'x'.repeat(1024)
			}
		});

		expect(resp.statusCode).toEqual(413);
		expect(resp.body).toEqual({
			'error':      'PAYLOAD TOO LARGE',
			'message':    'Payload Too Large',
			'statusCode': 413
		});
	});
});
