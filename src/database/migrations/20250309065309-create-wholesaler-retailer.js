'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WholesalerRetailers', {
      wholesaler_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'Wholesalers',
          key: 'id',
        }
      },
      retailer_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'Retailers',
          key: 'id',
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WholesalerRetailers');
  }
};