'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rating.belongsTo(models.Spellchecked, {
        foreignKey: 'spellcheckedId',
        onDelete: 'CASCADE',
      })
    }
  }
  Rating.init(
    {
      spellcheckedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: DataTypes.INTEGER,
      user_correction: DataTypes.STRING,
      user_notes: DataTypes.STRING,
      admin_correction: DataTypes.STRING,
      admin_notes: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Rating',
    }
  )
  return Rating
}
