'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wholesaler extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Retailer, {
        through: models.WholesalerRetailer,
        foreignKey: "wholesaler_id",
        otherKey: 'retailer_id',
        as: "retailers",
      });
    
      this.hasMany(models.Stock, { foreignKey: "wholesaler_id", as: "stocks"});
    }
  }
  Wholesaler.init({
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
    deleted_at: DataTypes.DATE,
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Wholesaler',
  });
  return Wholesaler;
};