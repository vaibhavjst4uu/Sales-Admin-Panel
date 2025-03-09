'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Wholesaler, { foreignKey: "wholesaler_id", as: "wholesaler" });
      this.belongsTo(models.Retailer, { foreignKey: "retailer_id", as: "retailer" });
    }
  }
  Stock.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
      allowNull: false,
      primaryKey: true,
    },
    wholesaler_id: DataTypes.UUID,
    retailer_id: DataTypes.UUID,
    stock_amount: DataTypes.DECIMAL,
    date: DataTypes.DATEONLY,
    deleted_at: DataTypes.DATE,
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    underscored: true,
    modelName: 'Stock',
  });
  return Stock;
};