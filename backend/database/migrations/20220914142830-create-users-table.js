'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // TABLE CREATION
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
        },
        email: {
          type: Sequelize.DataTypes.STRING(1024),
          allowNull: false,
        },
        password: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.log(err.messages);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
