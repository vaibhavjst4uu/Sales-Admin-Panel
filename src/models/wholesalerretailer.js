'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WholesalerRetailer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WholesalerRetailer.init({
    wholesaler_id: DataTypes.UUID,
    retailer_id: DataTypes.UUID
  }, {
    sequelize,
    timestamps: false,
    modelName: 'WholesalerRetailer',
  });
  return WholesalerRetailer;
};