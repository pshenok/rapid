import joi from "../../../app/Validator";
import { handler } from "../decorators";

export class ProbeController {
	@handler({
		description: "Liveness probe",
		method: "GET",
		path: "/_probe/live",
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					ok: joi.boolean()
				})
			})
		}
	})
	public async liveness(): Promise<object> {
		return {
			ok: true
		};
	}

	@handler({
		description: "Readiness probe",
		method: "GET",
		path: "/_probe/ready",
		validate: {},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					ok: joi.boolean()
				})
			})
		}
	})
	public async readiness(): Promise<object> {
		return {
			ok: true
		};
	}
}
