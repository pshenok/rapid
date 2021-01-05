import { Model, DataTypes, Sequelize } from "sequelize";
import { Dog } from "../../../domain/dog/Dog";

export class DogModel extends Model {
	public id!: string;
	public name!: string;
	public breed!: string;
	public createdAt?: Date;
	public readonly updatedAt?: Date;

	static fromEntity(dog: Dog): DogModel {
		return new DogModel(dog);
	}

	public toEntity(): Dog {
		return new Dog(this);
	}

	public static initWith(sequelize: Sequelize): void {
		DogModel.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false
				},
				breed: {
					type: DataTypes.STRING,
					allowNull: false
				},
				createdAt: {
					type: DataTypes.DATE,
					defaultValue: new Date(),
					allowNull: false
				},
				updatedAt: {
					type: DataTypes.DATE,
					defaultValue: new Date(),
					allowNull: false
				}
			},
			{
				tableName: "dogs",
				sequelize: sequelize
			}
		);
	}

	public static initRelations(): void {
		// relations
	}
}
