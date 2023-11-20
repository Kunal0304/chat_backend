'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'mobile', {
      type: Sequelize.STRING, // Change the data type based on your requirements
    });
    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.STRING, // Change the data type based on your requirements
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'mobile');
    await queryInterface.removeColumn('Users', 'gender');
  }
};
