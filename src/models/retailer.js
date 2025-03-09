'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Retailer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Wholesaler, {
        through: models.WholesalerRetailer,
        foreignKey: "retailer_id",
        otherKey: "wholesaler_id",
        as: "wholesalers",
      });
    
      this.hasMany(models.Stock, { foreignKey: "retailer_id", as: "stocks" });
    }
  }
  Retailer.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIndianMobile(value) {
          if (!/^[6-9]\d{9}$/.test(value)) {
            throw new Error('Mobile number must be a valid Indian mobile number');
          }
        }
      }
    },
    status: DataTypes.ENUM('active', 'inactive'),
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    underscored: true,
    modelName: 'Retailer',
  });
  return Retailer;
};