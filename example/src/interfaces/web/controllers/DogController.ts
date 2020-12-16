import joi from "../../../app/Validator";
import { Request } from "express";
import { handler } from "../decorators";
import { DogService } from "../../../domain/dog/DogService";

export class DogController {
	constructor(private dogService: DogService) {}

	@handler({
		description: "Example GET request",
		method: "GET",
		path: "/dogs/:dogId",
		validate: {
			params: joi.object().keys({
				dogId: joi.string().required()
			})
		},
		response: {
			200: joi.object().keys({
				data: joi.object().keys({
					name: joi.string().required()
				})
			})
		}
	})
	public async getDogById(req: Request): Promise<any> {
		console.log(req.params);
		const dog = await this.dogService.getDog({
			id: req.params.dogId
		});
		return {
			name: dog.name
		};
	}
}
