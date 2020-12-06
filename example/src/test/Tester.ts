import {AxiosRequestConfig} from 'axios';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';
import {AwilixContainer} from 'awilix';
import {Container} from '../di/Container';
import {IInterface} from '../interfaces/interfaces.types';
import {Config} from '../app/Config';
import {App} from '../app/App';


export class Tester {
	public url!: string;
	public app!: App;
	public web!: IInterface;
	public config!: Config;
	public container!: AwilixContainer;
	public httpsAgent!: https.Agent;
	public data!: any;

	public async start (env?: {bodyLimit?: number}): Promise<void> {
		jest.setTimeout(60000);

		dotenv.config();

		process.env.NODE_ENV   = 'test';
		process.env.WEB_PORT   = '0';
		process.env.DB_DB      = `test_${process.env.DB_DB}`;
		process.env.BODY_LIMIT = String(Number(env && env.bodyLimit) || 256);

		this.data = {};

		this.container = Container.create();
		this.app = this.container.cradle.app;

		await this.app.init();
		await this.app.start();

		this.web    = this.container.cradle.web;
		this.config = this.container.cradle.config;

		this.url = `http://localhost:${this.web.getPort()}`;
	}

	public async stop (): Promise<void> {
		await this.app.stop();
	}

	public async request (method: 'GET'|'POST'|'PATCH'|'DELETE', path: string, opts: any = {}): Promise<any> {
		let query = '';

		if (opts.query) {
			query = new URLSearchParams(opts.query).toString();
		}

		const url = path + (query ? `?${query}` : '');

		const options: AxiosRequestConfig = {
			method:  method,
			baseURL: this.url,
			url:     url,
			data:    opts.body,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Accept:         'application/json'
			},
			httpsAgent:     this.httpsAgent,
			validateStatus: () => {
				return true;
			},
		};

		try {
			const resp = await axios(options);

			return {
				statusCode: resp.status,
				body:       resp.data,
			};
		} catch (err) {
			// tslint:disable:no-console
			console.error(err);

			throw err;
		}
	}
}
