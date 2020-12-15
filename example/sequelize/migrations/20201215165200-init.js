/* eslint @typescript-eslint/explicit-function-return-type: 0 */
module.exports = {
	up: async (queryInterface, DataTypes) => {

		await queryInterface.createTable('dogs', {
			id: {
				type:         DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey:   true,
			},
			name: {
				type:      DataTypes.STRING,
				allowNull: false,
			},
			breed: {
				type:      DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				type:         DataTypes.DATE,
				defaultValue: DataTypes.fn('NOW'),
				allowNull:    false,
			},
			updatedAt: {
				type:         DataTypes.DATE,
				defaultValue: DataTypes.fn('NOW'),
				allowNull:    false,
			},
		});

		await queryInterface.addIndex('dogs', { fields: ['name'] });
		await queryInterface.addIndex('dogs', { fields: ['createdAt'] });

		
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('dogs');
	},
};
