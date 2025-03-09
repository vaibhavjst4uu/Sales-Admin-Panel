'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Automatically generates UUID
      },
      wholesaler_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Wholesalers',
          key: 'id',
        }
      },
      retailer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Retailers',
          key: 'id',
        }
      },
      stock_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add an index to improve query performance
    await queryInterface.addIndex('Stocks', ['wholesaler_id', 'retailer_id', 'date']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stocks');
  }
};