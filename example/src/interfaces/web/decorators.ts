import {SchemaLike} from 'joi';


export interface IHandlerData {
	description: string;
	method: 'GET' | 'POST' | 'PUT' |'PATCH' | 'DELETE';
	path: string;
	validate: {
		query?: SchemaLike;
		body?: SchemaLike;
		params?: SchemaLike;
		headers?: SchemaLike;
	};
	response: {
		[statusCode: number]: SchemaLike;
	};
	options?: {
		sendFile: boolean;
		deleteAfterSend: boolean;
	};
	handler?: (req: any, res: any) => any;
	processReq?: (req: any, res?: any) => any;
}

export function handler (handlerData: IHandlerData) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		Reflect.defineMetadata('handler:data', handlerData, target, propertyKey);
	};
}
